import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCart,
    removeCartItem as apiRemoveCart } from '../services/CartServices';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        // Retrieve user information from local storage
        const authUser = JSON.parse(localStorage.getItem('authUser'));
        
        // Only fetch the cart if the user is a buyer
        if (authUser && authUser.role === 'buyer') {
            setLoading(true);
            try {
                const data = await getCart();
                setCart(data);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
                // In case of an error (e.g., unauthorized), clear the cart state
                setCart({ items: [], total: 0 });
            } finally {
                setLoading(false);
            }
        } else {
            // For non-buyers (sellers, admins, guests), do not fetch cart data
            // and ensure the cart state is empty.
            setCart({ items: [], total: 0 });
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity) => {
        try {
            await apiAddToCart(productId, quantity);
            await fetchCart(); // Refresh cart after action
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    const updateCartItem = async (productId, quantity) => {
        try {
            await apiUpdateCart(productId, quantity);
            await fetchCart();
        } catch (error) {
            console.error('Failed to update cart item:', error);
        }
    };

    const removeCartItem = async (productId) => {
        try {
            await apiRemoveCart(productId);
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove cart item:', error);
        }
    };
    
    // Clear cart (frontend only, to reflect empty state)
    const clearCart = () => setCart({ items: [], total: 0 });

    useEffect(() => {
        fetchCart();
    }, []); // Empty dependency array means this runs once on mount

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};