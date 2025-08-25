import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, BadgePercent, ShieldCheck, Undo2, CheckCircle } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/OrdersServices';

const CartPage = () => {
    const { cart, loading, updateCartItem, removeCartItem, clearCart } = useCart();
    const cartItems = cart.items;
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + tax + shipping - discount;

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateCartItem(productId, newQuantity);
        toast.success('Quantity updated!');
    };

    const handleRemoveItem = async (productId) => {
        await removeCartItem(productId);
        toast.success('Product removed from cart!');
    };

    const handleClearCart = async () => {
        await clearCart();
        toast.info('Your cart has been cleared.');
    };

    const applyCoupon = () => {
        if (couponCode.toUpperCase() === 'SAVE10') {
            setDiscount(subtotal * 0.1);
            toast.success('Coupon applied!');
        } else {
            setDiscount(0);
            toast.error('Invalid coupon code.');
        }
    };

    const handleCheckout = () => {
        // Navigate to the checkout page instead of creating the order here
        navigate('/checkout');
    };

    if (loading) {
        return <p className="text-center mt-10 text-gray-500">Loading your cart...</p>;
    }

    if (orderSuccess) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg shadow-lg text-center">
                    <CheckCircle className="h-20 w-20 text-green-500 mb-6 animate-pulse" />
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-lg text-gray-600 mb-8">Thank you for your purchase. Your order has been placed successfully.</p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button onClick={() => navigate('/orders')} className="px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md">
                            View My Orders
                        </button>
                        <button onClick={() => navigate('/')} className="px-6 py-3 font-semibold text-blue-600 transition-colors rounded-lg bg-gray-100 hover:bg-gray-200">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('/')} className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
                    <ArrowLeft className="mr-1 h-5 w-5" /> Continue Shopping
                </button>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <ShoppingCart className="mr-2 h-6 w-6" /> Your Shopping Cart
                </h1>
            </div>
            {cartItems.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <ShoppingCart className="text-gray-400 h-8 w-8" />
                    </div>
                    <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
                    <button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 shadow-md">
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="hidden sm:grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 text-sm font-medium text-gray-500">
                                <div className="col-span-5">Product</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-3 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>
                            {cartItems.map(item => (
                                <div key={item.product?._id || item._id} className="p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition duration-150">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-12 sm:col-span-5 flex items-center">
                                            <div className="relative">
                                                <img src={item.product?.variations?.[0]?.images?.[0] || '/placeholder.png'} alt={item.product?.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                                            </div>
                                        </div>
                                        <div className="col-span-4 sm:col-span-2 text-center text-gray-700">
                                            ${(item.product?.price || 0).toFixed(2)}
                                        </div>
                                        <div className="col-span-4 sm:col-span-3">
                                            <div className="flex items-center justify-center">
                                                <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1 || processing} className={`w-8 h-8 flex items-center justify-center rounded-l border ${item.quantity <= 1 || processing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                                                    {item.quantity}
                                                </div>
                                                <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)} disabled={processing} className={`w-8 h-8 flex items-center justify-center rounded-r border ${processing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-4 sm:col-span-2 flex items-center justify-end">
                                            <span className="font-medium">
                                                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                            </span>
                                            <button onClick={() => handleRemoveItem(item.product._id)} disabled={processing} className="ml-4 text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove item">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-blue-50 p-4 rounded-lg">
                            <div className="mb-4 sm:mb-0">
                                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <BadgePercent className="h-5 w-5 mr-2 text-blue-600" /> Have a coupon code?
                                </h3>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon"
                                        className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-48"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className={`px-4 py-2 rounded-r-md ${!couponCode.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                            <button onClick={handleClearCart} className="flex items-center text-red-600 hover:text-red-800 font-medium">
                                <Trash2 className="mr-1 h-5 w-5" /> Clear Cart
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
                            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">Order Summary</h2>
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (10%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={processing || cartItems.length === 0}
                                className={`w-full py-3 px-4 rounded-lg mt-6 transition duration-200 shadow-md ${processing || cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                            >
                                {processing ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                            <div className="mt-4 text-sm text-gray-500">
                                <p className="flex items-center mb-1">
                                    <ShieldCheck className="h-4 w-4 mr-2 text-green-500" /> Secure checkout
                                </p>
                                <p className="flex items-center">
                                    <Undo2 className="h-4 w-4 mr-2 text-green-500" /> Free returns within 30 days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;