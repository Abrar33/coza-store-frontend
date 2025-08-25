import React, { useState, useEffect } from 'react';


const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL

// This is a placeholder component for fetching user auth token.
// In a real application, you would get this from your auth context or state management.
const useAuthToken = () => {
  // Replace with your actual token retrieval logic
  const [token, setToken] = useState('YOUR_AUTH_TOKEN_HERE');
  return token;
};

const OrderCard = ({ order }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-700';
      case 'delivered':
        return 'bg-teal-100 text-teal-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="order-card bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform duration-200 hover:shadow-lg hover:translate-y-[-5px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Order ID: <span className="text-gray-600 font-normal">{order._id}</span>
        </h2>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </div>
      <div className="mb-4 text-sm text-gray-500">
        <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Total: <span className="font-medium text-gray-700">${order.totalAmount.toFixed(2)}</span></p>
      </div>
      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 border-t pt-3">
            <div className="flex-grow">
              <p className="font-medium text-gray-800">{item.product.name}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              <p className="text-sm text-gray-500">Price: ${item.product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
