import React from "react";
// import { FaFacebookF, FaInstagram, FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-white pt-16 pb-6 relative">
      {/* Columns */}
      <div className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-5 sm:grid-cols-2 gap-10">
        {/* CATEGORIES */}
        <div>
          <h4 className="text-lg font-bold mb-4">CATEGORIES</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Men</li>
            <li>Women</li>
            <li>Shoes</li>
            <li>Watches</li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h4 className="text-lg font-bold mb-4">HELP</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Track Order</li>
            <li>Returns</li>
            <li>Shipping</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* GET IN TOUCH */}
        <div>
          <h4 className="text-lg font-bold mb-4">GET IN TOUCH</h4>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            Any questions? Let us know in store at 8th floor, 379 Hudson St,
            New York, NY 10018 or call us on (+1) 96 716 6879
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white text-black p-2 rounded-full hover:bg-blue-600 hover:text-white transition">
              {/* <FaFacebookF /> */}
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white text-black p-2 rounded-full hover:bg-pink-500 hover:text-white transition">
              {/* <FaInstagram /> */}
            </a>
          </div>
        </div>

        {/* NEWS LETTER */}
        <div className="md:col-span-2">
          <h4 className="text-lg font-bold mb-4">NEWS LETTER</h4>
          <input
            type="email"
            placeholder="email@example.com"
            className="w-full bg-transparent border-b-2 border-gray-400 pb-2 text-sm text-white focus:outline-none transition duration-500 focus:border-gradient-to-r from-pink-500 via-blue-500 to-purple-500"
            style={{
              borderImage: "linear-gradient(to right, #ec4899, #3b82f6, #8b5cf6) 1",
            }}
          />
          <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition text-sm">
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-16 border-t border-gray-700 pt-4 text-sm text-center text-gray-400 relative">
        <p>
          Copyright ©2025 All rights reserved | This template is made with 💙 by Colorlib
        </p>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="absolute right-6 bottom-6 bg-white text-black p-3 rounded-full shadow hover:bg-blue-500 hover:text-white transition"
        >
          {/* <FaArrowUp /> */}
        </button>
      </div>
    </footer>
  );
};

export default Footer;