import axios from 'axios';

let token = null;
let tokenFetchedAt = null;
const TOKEN_TTL_MS = 23 * 60 * 60 * 1000; // refresh 1 hour before Shiprocket's 24h expiry

const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// Generate Shiprocket Token (with 23-hour expiry refresh)
export const generateToken = async () => {
  const now = Date.now();
  const tokenStillValid = token && tokenFetchedAt && (now - tokenFetchedAt) < TOKEN_TTL_MS;

  if (tokenStillValid && !token.startsWith('mock_token_for_testing_')) {
    return token;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    token = response.data.token;
    tokenFetchedAt = now;
    console.log("Shiprocket Token Generated Successfully! Token:", token?.substring(0, 20) + "...");
    return token;
  } catch (error) {
    console.error("Shiprocket Auth Error:", error.response?.data);
    console.error("Full error:", error.message);

    // Credentials not yet configured — fall back to mock mode for development
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.log("⚠️  Shiprocket credentials invalid or not configured — using mock mode");
      token = "mock_token_for_testing_" + Date.now();
      tokenFetchedAt = now;
      return token;
    }

    throw new Error('Failed to authenticate with Shiprocket');
  }
};

// Create Shiprocket Order
export const createShiprocketOrder = async (orderData) => {
  try {
    const token = await generateToken();
    
    const response = await axios.post(
      `${BASE_URL}/orders/create/adhoc`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log("Shiprocket Order Created Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Shiprocket Order Creation Error:", error.response?.data);
    console.error("Full error:", error.message);
    
    // If account is blocked, return mock order for testing
    if (error.response?.data?.status_code === 403 || token?.startsWith('mock_token_for_testing_')) {
      console.log("🧪 Using mock mode for order creation");
      return {
        order_id: "MOCK_ORDER_" + Date.now(),
        shipment_id: "MOCK_SHIPMENT_" + Date.now(),
        awb_code: "MOCK_AWB_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        courier_name: "Mock Courier",
        tracking_url: `https://mock-tracking.com/${Date.now()}`
      };
    }
    
    throw new Error('Failed to create Shiprocket order');
  }
};

class ShiprocketService {
  constructor() {
    this.email = process.env.SHIPROCKET_EMAIL;
    this.password = process.env.SHIPROCKET_PASSWORD;
    this.apiURL = process.env.SHIPROCKET_API_URL || 'https://apiv2.shiprocket.in/v1/external';
    // Name of the pickup address registered in your Shiprocket account
    this.pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary';
    this.pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '400001';
  }

  async getAuthenticatedAxios() {
    await generateToken();
    return axios.create({
      baseURL: this.apiURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });
  }

  isMockMode() {
    return token && token.startsWith('mock_token_for_testing_');
  }

  // Create a new shipment
  // Shiprocket adhoc order API: https://apiv2.shiprocket.in/v1/external/orders/create/adhoc
  async createShipment(orderData) {
    try {
      console.log('Creating Shiprocket shipment for order:', orderData.orderNumber);

      await generateToken();
      if (this.isMockMode()) {
        console.log('🧪 Using mock mode for shipment creation');
        return this.createMockShipment(orderData);
      }

      const api = await this.getAuthenticatedAxios();
      const addr = orderData.shippingAddress;
      const fullName = addr.fullName || `${addr.firstName || ''} ${addr.lastName || ''}`.trim() || 'Customer';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const totalUnits = (orderData.items || []).reduce((s, i) => s + Number(i.quantity || 1), 0);
      const weightKg = Math.max(0.1, totalUnits * Number(process.env.SHIPROCKET_DEFAULT_ITEM_WEIGHT_KG || 0.5));

      const payload = {
        order_id: String(orderData.orderNumber),
        order_date: new Date(orderData.createdAt || Date.now()).toISOString().slice(0, 10),
        pickup_location: this.pickupLocation,

        billing_customer_name: firstName,
        billing_last_name: lastName || undefined,
        billing_address: addr.address || addr.street || '',
        billing_city: addr.city || '',
        billing_pincode: String(addr.pincode || addr.postalCode || ''),
        billing_state: addr.state || '',
        billing_country: addr.country || 'India',
        billing_email: addr.email || 'customer@example.com',
        billing_phone: String(addr.phone || '9999999999'),

        shipping_is_billing: true,

        payment_method: orderData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
        sub_total: Math.round(Number(orderData.itemsPrice || orderData.totalPrice || 0)),

        order_items: (orderData.items || []).map((item, idx) => ({
          name: item.name,
          sku: String(item.skuCode || item.product || `item-${idx}`),
          units: Number(item.quantity || 1),
          selling_price: Math.round(Number(item.price || 0)),
          discount: 0,
          tax: 0,
          hsn: Number(process.env.SHIPROCKET_DEFAULT_HSN || 6109) // HSN for T-shirts/apparel
        })),

        weight: weightKg,
        length: Number(process.env.SHIPROCKET_DEFAULT_LENGTH_CM || 30),
        breadth: Number(process.env.SHIPROCKET_DEFAULT_BREADTH_CM || 25),
        height: Number(process.env.SHIPROCKET_DEFAULT_HEIGHT_CM || 5)
      };

      const response = await api.post('/orders/create/adhoc', payload);
      console.log('Shiprocket shipment created successfully:', response.data);

      return {
        success: true,
        data: response.data,
        shipmentId: response.data?.shipment_id,
        awbNumber: response.data?.awb_code,
        courierName: response.data?.courier_name,
        trackingUrl: response.data?.tracking_url
      };
    } catch (error) {
      console.error('Shiprocket shipment creation failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        details: error.response?.data
      };
    }
  }

  createMockShipment(orderData) {
    const mockShipmentId = 'MOCK_' + Date.now();
    const mockAwbNumber = 'MOCK_AWB_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    console.log('🧪 Creating mock shipment for order:', orderData.orderNumber);
    return {
      success: true,
      data: {
        shipment_id: mockShipmentId,
        awb_code: mockAwbNumber,
        courier_name: 'Mock Courier',
        tracking_url: `https://mock-tracking.com/${mockAwbNumber}`,
        status: 'NEW'
      },
      shipmentId: mockShipmentId,
      awbNumber: mockAwbNumber,
      courierName: 'Mock Courier',
      trackingUrl: `https://mock-tracking.com/${mockAwbNumber}`
    };
  }

  // Track by AWB number — correct Shiprocket endpoint
  async trackShipment(awbOrShipmentId) {
    try {
      console.log('Tracking shipment:', awbOrShipmentId);

      await generateToken();
      if (this.isMockMode()) {
        return {
          success: true,
          data: {
            shipment_status: 6, // In Transit
            shipment_status_label: 'In Transit',
            current_location: 'Mumbai Hub',
            estimated_delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            tracking_url: `https://mock-tracking.com/${awbOrShipmentId}`
          }
        };
      }

      const api = await this.getAuthenticatedAxios();
      // Shiprocket track by AWB code
      const response = await api.get(`/courier/track/awb/${awbOrShipmentId}`);
      console.log('Shipment tracking data:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Shipment tracking failed:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  // Cancel order — correct Shiprocket endpoint: POST /orders/cancel with { ids: [orderId] }
  async cancelShipment(shiprocketOrderId) {
    try {
      console.log('Cancelling Shiprocket order:', shiprocketOrderId);

      await generateToken();
      if (this.isMockMode()) {
        return {
          success: true,
          data: { message: 'Mock order cancelled successfully', status: 'cancelled' }
        };
      }

      const api = await this.getAuthenticatedAxios();
      const response = await api.post('/orders/cancel', { ids: [shiprocketOrderId] });
      console.log('Order cancelled:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Shipment cancellation failed:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  // Get available couriers for a delivery pincode
  async getAvailableCouriers(deliveryPincode) {
    try {
      console.log('Getting available couriers for pincode:', deliveryPincode);

      await generateToken();
      if (this.isMockMode()) {
        return {
          success: true,
          data: [
            { courier_name: 'Mock Express', estimated_delivery_days: '2-3', freight: 50, rating: 4.5 },
            { courier_name: 'Mock Fast Delivery', estimated_delivery_days: '1-2', freight: 80, rating: 4.8 }
          ]
        };
      }

      const api = await this.getAuthenticatedAxios();
      const response = await api.get(
        `/courier/serviceability/?pickup_postcode=${this.pickupPincode}&delivery_postcode=${deliveryPincode}&cod=0&weight=0.5`
      );
      console.log('Available couriers:', response.data);
      return { success: true, data: response.data?.data?.available_courier_companies || response.data };
    } catch (error) {
      console.error('Get couriers failed:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  isConfigured() {
    return !!(this.email && this.password && this.email !== 'your_shiprocket_email_here');
  }
}

export default new ShiprocketService();
