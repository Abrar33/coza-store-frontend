// src/services/orderServices.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

// Create a new order
export const createOrder = async ({ customerInfo, items }) => {
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;
  if (!token) throw new Error("Authentication token not found");

  const orderItems = items.map((item) => ({
    product: item.product?._id || item._id,
    quantity: item.quantity,
  }));

  const orderPayload = { customerInfo, items: orderItems };

  try {
    const response = await axios.post(`${BASE_URL}/orders`, orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create order:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Order creation failed");
  }
};

// Get seller orders
export const getSellerOrders = async () => {
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;
  if (!token) throw new Error("Authentication token not found");

  try {
    const response = await axios.get(`${BASE_URL}/orders/seller-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch seller orders:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Seller orders fetch failed");
  }
};

// Get buyer orders
export const getBuyerOrders = async () => {
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;
  if (!token) throw new Error("Authentication token not found");

  try {
    const response = await axios.get(`${BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch buyer orders:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Buyer orders fetch failed");
  }
};

// Get dashboard stats
export const getDashboardStats = async () => {
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;
  if (!token) throw new Error("Authentication token not found");

  try {
    const response = await axios.get(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Dashboard stats fetch failed");
  }
};

// Fetch single order
export const fetchOrderById = async (orderId, isSeller = false) => {
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;
  if (!token) throw new Error("Authentication token not found");

  const endpoint = isSeller
    ? `${BASE_URL}/orders/seller-orders/${orderId}`
    : `${BASE_URL}/orders/${orderId}`;

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch order:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Order fetch failed");
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status, token) => {
  try {
    
    const res = await axios.put(
      `${BASE_URL}/orders/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Order update error:", err.response?.data || err.message);
    throw err.response?.data || { error: "Something went wrong" };
  }
};
export const getAllOrders = async () => {
    const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    console.log(token)
    if (!token) throw new Error("Authentication token not found");

    try {
        const response = await axios.get(`${BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all orders:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to retrieve all orders.");
    }
};