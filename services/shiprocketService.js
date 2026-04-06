import axios from 'axios';

class ShiprocketService {
  constructor() {
    this.apiKey = process.env.SHIPROCKET_API_KEY;
    this.apiSecret = process.env.SHIPROCKET_API_SECRET;
    this.apiURL = process.env.SHIPROCKET_API_URL || 'https://api.shiprocket.in/v1';
    
    this.axios = axios.create({
      baseURL: this.apiURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      timeout: 30000
    });
  }

  // Create a new shipment
  async createShipment(orderData) {
    try {
      console.log('🚀 Creating Shiprocket shipment:', orderData);
      
      const shipmentPayload = {
        order_id: orderData.orderNumber,
        order_date: orderData.createdAt,
        pickup_location: {
          name: "Black Locust Warehouse",
          address: "123 Warehouse Street",
          city: "Mumbai",
          pin_code: "400001",
          state: "Maharashtra",
          country: "India"
        },
        shipping_customer: {
          name: orderData.shippingAddress.fullName,
          email: orderData.shippingAddress.email,
          phone: orderData.shippingAddress.phone
        },
        billing_customer: {
          name: orderData.shippingAddress.fullName,
          address: orderData.shippingAddress.address,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          pin_code: orderData.shippingAddress.pincode,
          country: orderData.shippingAddress.country
        },
        order_items: orderData.items.map(item => ({
          name: item.name,
          sku: item.skuCode || '',
          quantity: item.quantity,
          price: item.price,
          hsn: '6102', // Default HSN for clothing
          tax_rate: 5 // Standard GST for clothing
        })),
        payment_method: orderData.paymentMethod,
        sub_total: orderData.itemsPrice,
        total_amount: orderData.totalPrice,
        length: 10,
        breadth: 10,
        height: 5,
        weight: 0.5
      };

      const response = await this.axios.post('/orders/create/adhoc', shipmentPayload);
      
      console.log('✅ Shiprocket shipment created:', response.data);
      return {
        success: true,
        data: response.data,
        shipmentId: response.data?.shipment_id,
        awbNumber: response.data?.awb_code,
        courierName: response.data?.courier_name,
        trackingUrl: response.data?.tracking_url
      };
      
    } catch (error) {
      console.error('❌ Shiprocket shipment creation failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        details: error.response?.data
      };
    }
  }

  // Track a shipment
  async trackShipment(shipmentId) {
    try {
      console.log('📦 Tracking shipment:', shipmentId);
      
      const response = await this.axios.get(`/orders/track/${shipmentId}`);
      
      console.log('✅ Shipment tracking data:', response.data);
      return {
        success: true,
        data: response.data
      };
      
    } catch (error) {
      console.error('❌ Shipment tracking failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Cancel a shipment
  async cancelShipment(shipmentId) {
    try {
      console.log('❌ Cancelling shipment:', shipmentId);
      
      const response = await this.axios.post(`/orders/cancel/${shipmentId}`);
      
      console.log('✅ Shipment cancelled:', response.data);
      return {
        success: true,
        data: response.data
      };
      
    } catch (error) {
      console.error('❌ Shipment cancellation failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Get available couriers
  async getAvailableCouriers(pincode) {
    try {
      console.log('🚚 Getting available couriers for:', pincode);
      
      const response = await this.axios.get(`/courier/serviceability/?pickup_pincode=400001&delivery_pincode=${pincode}&weight=0.5&length=10&breadth=10&height=5`);
      
      console.log('✅ Available couriers:', response.data);
      return {
        success: true,
        data: response.data?.data || response.data
      };
      
    } catch (error) {
      console.error('❌ Get couriers failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Check if Shiprocket is configured
  isConfigured() {
    return !!(this.apiKey === 'your_shiprocket_api_key_here' || !this.apiKey);
  }
}

export default new ShiprocketService();
