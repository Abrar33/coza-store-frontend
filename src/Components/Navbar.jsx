import React, { useState } from 'react';
import useAuth from '../Hooks/useAuth';

const Navbar = ({openCart}) => {
  const [isOpen, setIsOpen] = useState(false);
const {isAuthenticated,role } = useAuth(); // Get user authentication status and role
  const handleLogout = () => {
    localStorage.removeItem('authUser');
    console.log('User logged out');
    window.location.reload(); // Reload to reflect changes
  };

  return (
    <>
      {/* Announcement Bar (Fixed Height & Relative Positioning) */}
      <div className="bg-[#333333] w-full h-[48px] flex flex-col sm:flex-row justify-between items-center px-4 z-50">
        <div className="text-gray-300 text-sm font-semibold text-center sm:text-left">
          Free shipping for standard order over $100
        </div>
        <div className="flex space-x-4 sm:space-x-8 text-white text-sm font-medium">
          <a href="/" className="hover:text-gray-300 border-l border-gray-500 pl-4">Helps & Faqs</a>
{!isAuthenticated ? (
        <>
          <a href="/landing" className="hover:text-gray-300 border-l border-gray-500 pl-4">Sign Up</a>
          <a href="/signin" className="hover:text-gray-300 border-l border-gray-500 pl-4">Login</a>
        </>
      ) : (
        <button
          onClick={handleLogout}
          className="hover:text-gray-300 border-l border-gray-500 pl-4"
        >
          Logout
        </button>
      )}
      </div>
      </div>

      {/* Main Navigation Bar (Sticky Below Announcement) */}
      <nav className="sticky top-0 w-full z-40   ">
        <div className="flex justify-between items-center  max-w-screen-xl px-4">
          
          {/* Logo */}
          <div className="text-xl font-bold text-gray-800">Coza Store</div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-6 text-sm font-semibold text-gray-700">
            <li><a href="/" className="hover:text-blue-500">Home</a></li>
            <li><a href="/features" className="hover:text-blue-500">Features</a></li>
            <li><a href="/blog" className="hover:text-blue-500">Blog</a></li>
            <li><a href="/about" className="hover:text-blue-500">About</a></li>
          </ul>

          {/* Desktop Icons */}
          <div className="hidden md:flex gap-6 text-2xl text-gray-700">
            <i onClick={openCart} className="ri-shopping-cart-line hover:text-blue-500"></i>
            {role!=="seller"?(<a href="/favorites"><i className="ri-heart-line hover:text-blue-500"></i></a>):
           <a href='/seller-store'> <i class="ri-store-3-fill hover:text-blue-500"></i></a>}
          </div>

          {/* Mobile Toggler */}
          <button
            className="md:hidden text-gray-700 text-3xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
          } px-4 py-4`}
        >
          <ul className="flex flex-col gap-4 text-sm font-semibold text-gray-700">
            <li><a href="/" className="hover:text-blue-500">Home</a></li>
            <li><a href="/features" className="hover:text-blue-500">Features</a></li>
            <li><a href="/blog" className="hover:text-blue-500">Blog</a></li>
            <li><a href="/about" className="hover:text-blue-500">About</a></li>
          </ul>
          <div className="flex gap-4 mt-4 text-2xl text-gray-700">
            {/* <i className="ri-shopping-cart-line hover:text-blue-500"></i> */}
            <i onClick={openCart} className="ri-shopping-cart-line hover:text-blue-500"></i>
            {role!=="seller"?(<a href="/favorites"><i className="ri-heart-line hover:text-blue-500"></i></a>):
           <a href='/seller-store'> <i class="ri-store-3-fill hover:text-blue-500"></i></a>}
          </div>
        </div>
      </nav>
      
    </>
  );
};

export default Navbar;