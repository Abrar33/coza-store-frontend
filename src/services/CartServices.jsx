import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cart';

// Get a user's cart
export const getCart = async () => {
    const token = JSON.parse(localStorage.getItem('authUser'))?.token;
    if (!token) return { items: [] };
    
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return { items: [] };
    }
};

// Add a product to the cart
export const addToCart = async (productId, quantity) => {
    const token = JSON.parse(localStorage.getItem('authUser'))?.token;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const body = { productId, quantity };
    const response = await axios.post(`${API_URL}/add`, body, config);
    return response.data;
};

// Update a product's quantity in the cart
export const updateCartItem = async (productId, quantity) => {
    const token = JSON.parse(localStorage.getItem('authUser'))?.token;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const body = { productId, quantity };
    const response = await axios.put(`${API_URL}/update`, body, config);
    return response.data;
};

// Remove a product from the cart
export const removeCartItem = async (productId) => {
    const token = JSON.parse(localStorage.getItem('authUser'))?.token;
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId } // For DELETE requests with a body
    };
    const response = await axios.delete(`${API_URL}/remove`, config);
    return response.data;
};