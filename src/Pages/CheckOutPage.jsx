import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/OrdersServices';
import { useCart } from '../Context/CartContext';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const cartItems = cart.items;
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        address: '',
        city: '',
        zip: '',
        country: '',
        phone: '',
        email: ''
    });

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            // Include customerInfo and items in the order payload
            const orderPayload = {
                customerInfo,
                items: cartItems
            };

            await createOrder(orderPayload);
            toast.success('Your order has been placed successfully!');
            
            // Clear the cart after a successful order
            await clearCart();
            
            navigate('/my-orders'); // Navigate to a success page
        } catch (error) {
            console.error('Failed to place order:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <p>Your cart is empty. Please add items to proceed to checkout.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">
                    Continue Shopping
                </button>
            </div>
        );
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + tax + shipping; // Recalculate total for display

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <ArrowLeft className="mr-1 h-5 w-5" /> Back to Cart
            </button>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Checkout Details</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handlePlaceOrder}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" value={customerInfo.name} onChange={handleInfoChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" value={customerInfo.email} onChange={handleInfoChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" name="address" value={customerInfo.address} onChange={handleInfoChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" name="city" value={customerInfo.city} onChange={handleInfoChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                            <input type="text" name="zip" value={customerInfo.zip} onChange={handleInfoChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input type="text" name="country" value={customerInfo.country} onChange={handleInfoChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" name="phone" value={customerInfo.phone} onChange={handleInfoChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full py-3 px-4 rounded-lg mt-4 transition duration-200 shadow-md ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {processing ? 'Placing Order...' : `Place Order ($${total.toFixed(2)})`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;