import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Cart from '../Components/Cart';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ darkMode, setDarkMode }) => {
  const [showCart, setShowCart] = useState(false);

  const cartItems = [
    { title: 'Sneakers', quantity: 2, amount: 49.99, image: '/images/sneakers.jpg' },
    { title: 'Backpack', quantity: 1, amount: 79.99, image: '/images/backpack.jpg' },
  ]; // Replace with actual cart logic

  const openCart = () => setShowCart(true);
  const closeCart = () => setShowCart(false);

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} openCart={openCart} />
      {showCart && (
        <Cart showCart={showCart} closeCart={closeCart} cartItems={cartItems} />
      )}
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;