import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchOrderById,updateOrderStatus  } from "../services/OrdersServices";

// Fetch single order (buyer OR seller depending on API)




export default function OrderDetail({ isSeller = false, darkMode = false }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(id, isSeller);
        setOrder(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id, isSeller]);

 const handleUpdateStatus = async (status) => {
  try {
    const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    // The backend returns an object with an 'order' property.
    const response = await updateOrderStatus(id, status, token);
    
    // Set the state to the nested order object from the response
    setOrder(response.order); 
    
    toast.success(`Order status updated to ${status}`);
  } catch (err) {
    toast.error(err.message || "Something went wrong.");
  }
};

  const textColor = darkMode ? "text-white" : "text-gray-800";
  const subTextColor = darkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const bgHeader = darkMode ? "bg-gray-700" : "bg-gray-100";
  const hoverRow = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const cardBg = darkMode ? "bg-gray-900" : "bg-white";

  if (loading) return <p className={`text-center py-4 ${subTextColor}`}>Loading order...</p>;
  if (!order) return <p className={`text-center py-4 ${subTextColor}`}>Order not found</p>;

  return (
    <div className={`max-w-5xl mx-auto p-6 shadow rounded-lg ${cardBg}`}>
      {/* Customer Info */}
      <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Customer Information</h2>
      <div className={`border ${borderColor} p-4 rounded-lg mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4`}>
        <p><strong>Name:</strong> {order.customerInfo?.name}</p>
        <p><strong>Email:</strong> {order.customerInfo?.email}</p>
        <p><strong>Phone:</strong> {order.customerInfo?.phone}</p>
        <p><strong>Address:</strong> {order.customerInfo?.address}</p>
      </div>

      {/* Items */}
      <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Order Items</h2>
      <div className="overflow-x-auto">
        <table className={`min-w-full border ${borderColor} rounded-lg overflow-hidden`}>
          <thead className={bgHeader}>
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Product</th>
              <th className="p-3 text-center text-sm font-semibold">Price</th>
              <th className="p-3 text-center text-sm font-semibold">Qty</th>
              <th className="p-3 text-center text-sm font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item._id} className={`border-t ${borderColor} ${hoverRow}`}>
                <td className="p-3 text-left text-sm">{item.product?.name}</td>
                <td className="p-3 text-center text-sm">${item.product?.price}</td>
                <td className="p-3 text-center text-sm">{item.quantity}</td>
                <td className="p-3 text-center text-sm">${item.quantity * item.product?.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={bgHeader}>
              <td colSpan="3" className="p-3 text-right font-semibold text-sm">Total:</td>
              <td className="p-3 text-center font-semibold text-sm">${order.sellerTotalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary */}
      <div className={`mt-6 border ${borderColor} p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4`}>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment:</strong> {order.paymentStatus}</p>
        <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      {/* Seller Actions */}
      {isSeller && (
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => handleUpdateStatus("shipped")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Mark as Shipped
          </button>
          <button
            onClick={() => handleUpdateStatus("delivered")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Mark as Delivered
          </button>
          <button
            onClick={() => handleUpdateStatus("cancelled")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}