import StoreOrder from '../models/StoreOrder.js';

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

const adminRoles = ['admin', 'super admin'];

const requireEnv = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
};

async function shiprocketLogin() {
  const email = requireEnv('SHIPROCKET_EMAIL');
  const password = requireEnv('SHIPROCKET_PASSWORD');

  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || 'Shiprocket login failed');
  }

  const token = data?.token;
  if (!token) throw new Error('Shiprocket login returned no token');
  return token;
}

async function createAdhocShipment({ payload, token }) {
  const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || 'Shiprocket shipment creation failed');
  }

  return data;
}

async function assignAwb({ shipmentId, token }) {
  const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/awb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ shipment_id: shipmentId })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || 'Shiprocket AWB assignment failed');
  }
  return data;
}

export const createShiprocketShipment = async (req, res) => {
  try {
    const { orderId } = req.body || {};
    if (!orderId) return res.status(400).json({ message: 'Missing orderId' });

    const order = await StoreOrder.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (String(order.user) !== String(req.user._id) && !adminRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // If Shiprocket isn't configured, don't block order placement.
    const shiprocketConfigured =
      process.env.SHIPROCKET_EMAIL &&
      process.env.SHIPROCKET_PASSWORD &&
      process.env.SHIPROCKET_PICKUP_LOCATION;

    if (!shiprocketConfigured) {
      return res.status(503).json({
        message: 'Shiprocket is not configured (set SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, SHIPROCKET_PICKUP_LOCATION)'
      });
    }

    const shippingAddress = order.shippingAddress || {};
    const firstName = shippingAddress.firstName || shippingAddress.fullName || 'Customer';
    const lastName = shippingAddress.lastName || '';

    const email = shippingAddress.email || 'customer@example.com';
    const phone = shippingAddress.phone || '0000000000';
    const country = shippingAddress.country || 'India';

    const subTotal = Number(order.itemsPrice) || 0;

    const perItemWeightKg = Number(process.env.SHIPROCKET_DEFAULT_ITEM_WEIGHT_KG || 2.0);
    const totalUnits = (order.items || []).reduce((sum, it) => sum + Number(it.quantity || 0), 0);
    const weightKg = Math.max(0.1, totalUnits * perItemWeightKg);

    // Shiprocket expects dimensions > 0.5 cms.
    const length = Number(process.env.SHIPROCKET_DEFAULT_LENGTH_CM || 10);
    const breadth = Number(process.env.SHIPROCKET_DEFAULT_BREADTH_CM || 10);
    const height = Number(process.env.SHIPROCKET_DEFAULT_HEIGHT_CM || 5);

    const payload = {
      order_id: String(order.orderNumber),
      order_date: new Date().toISOString().slice(0, 10),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
      channel_id: process.env.SHIPROCKET_CHANNEL_ID || undefined,
      billing_customer_name: firstName,
      billing_last_name: lastName || undefined,
      billing_address: shippingAddress.address || '',
      billing_city: shippingAddress.city || '',
      billing_pincode: shippingAddress.pincode,
      billing_state: shippingAddress.state || '',
      billing_country: country,
      billing_email: email,
      billing_phone: phone,

      shipping_is_billing: true,
      payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',

      sub_total: Math.round(subTotal),
      order_items: (order.items || []).map((it, idx) => ({
        name: it.name,
        sku: String(it.product || it.name || `item-${idx}`),
        units: Number(it.quantity || 0),
        selling_price: Math.round(Number(it.price || 0)),
        discount: 0,
        tax: 0,
        hsn: process.env.SHIPROCKET_DEFAULT_HSN
          ? Number(process.env.SHIPROCKET_DEFAULT_HSN)
          : undefined,

        // Dimensions/weight can be sent per request; leave per-item simple.
        // Shiprocket uses the top-level shipment weight/dimensions.
      })),

      weight: weightKg,
      length,
      breadth,
      height
    };

    const token = await shiprocketLogin();
    const shipmentResp = await createAdhocShipment({ payload, token });

    const shipmentId = shipmentResp?.shipment_id || shipmentResp?.shipmentId;
    const shiprocketOrderId = shipmentResp?.order_id || shipmentResp?.orderId;

    let awbCode;
    let courierName;
    if (shipmentId) {
      const awbResp = await assignAwb({ shipmentId, token });
      awbCode = awbResp?.awb_code || awbResp?.awbCode || awbResp?.awb_number;
      courierName = awbResp?.courier_name || awbResp?.courierName || awbResp?.courier;
    }

    order.shiprocket = {
      orderId: shiprocketOrderId,
      shipmentId: shipmentId ? String(shipmentId) : undefined,
      awbNumber: awbCode ? String(awbCode) : undefined,
      courierName: courierName ? String(courierName) : undefined,
      trackingUrl:
        awbCode && process.env.SHIPROCKET_TRACKING_URL_TEMPLATE
          ? process.env.SHIPROCKET_TRACKING_URL_TEMPLATE.replace('{awb}', String(awbCode))
          : undefined,
      raw: shipmentResp
    };

    // For now we mark it as shipped after adhoc shipment + AWB assignment.
    order.status = 'shipped';

    await order.save();

    return res.json({
      success: true,
      orderId: order._id,
      shiprocket: order.shiprocket
    });
  } catch (err) {
    console.error('createShiprocketShipment:', err);
    return res.status(500).json({ message: err.message || 'Shiprocket shipment failed' });
  }
};

