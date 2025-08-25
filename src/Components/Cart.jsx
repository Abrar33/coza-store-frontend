import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import useAuth from '../Hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const Cart = ({ showCart, closeCart }) => {
  const cartRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartItems = cart?.items || [];
console.log(cartItems)
  useEffect(() => {
    if (showCart) {
      gsap.fromTo(
        cartRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.4, ease: "power2.out" }
      );
    } else {
      gsap.to(cartRef.current, { x: "100%", duration: 0.3, ease: "power2.in" });
    }
  }, [showCart]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.amount,
    0
  );

  const handleCart = () => {
    gsap.to(cartRef.current, {
      x: "100%",
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        closeCart(); // ✅ closes modal
        navigate('/cart'); // ✅ navigates to cart page
      }
    });
  };

  return (
    <div
      ref={cartRef}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-bold text-gray-800">YOUR CART</h2>
        <button onClick={closeCart} className="text-gray-500 hover:text-gray-800">
          X
        </button>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto h-[calc(100vh-200px)]">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
            <p className="text-md font-medium mb-2">You're not logged in.</p>
            <p className="text-sm mb-4">Please sign in to view your cart items.</p>
            <a
              href="/signin"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Login
            </a>
          </div>
        ) : cartItems.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div key={index} className="flex gap-4">
                <img
                  src={item.product?.variations?.[0]?.images?.[0]}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                 <p className="text-sm text-gray-600">
  {item.quantity} × ${(item.product?.price || 0).toFixed(2)}
</p>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {isAuthenticated && cartItems.length > 0 && (
        <div className="px-6 py-4 border-t">
          <p className="text-sm font-bold text-gray-700 mb-4">
            Total: ${totalAmount.toFixed(2)}
          </p>
          <div className="flex justify-between">
            <button
              onClick={handleCart}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
            >
              View Cart
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;