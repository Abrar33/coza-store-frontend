// pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { getBuyerOrders } from "../services/OrdersServices";
import { Loader2, Package, ClipboardList } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getBuyerOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading your orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="text-center py-20 text-gray-500">
        <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-70" />
        <p className="text-lg font-medium">You have no orders yet.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                <strong className="text-gray-700">Order ID:</strong>{" "}
                {order._id}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <ul className="divide-y divide-gray-200">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      {item.product?.name || "Deleted Product"}
                    </span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    {item.quantity} pcs{" "}
                    <span className="ml-2 font-semibold text-gray-800">
                      ${item.product?.price || 0}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="text-right mt-4 text-gray-700 font-semibold">
              Total: $
              {order.items.reduce(
                (sum, item) => sum + (item.product?.price || 0) * item.quantity,
                0
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
