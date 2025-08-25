import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function InventoryForm({isAdmin}) {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(0);
  const [warehouse, setWarehouse] = useState("");
  const [minimumStock, setMinimumStock] = useState(1);
  const navigate = useNavigate();
  const handleSave = async () => {
    const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    await fetch("http://localhost:3000/api/inventory/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: id,
        quantityAvailable: quantity,
        warehouseLocation: warehouse,
        minimumStockAlert: minimumStock,
      }),
    });
    toast.success("Inventory updated!");
const path=isAdmin?'/admin-dashboard/products':"/seller-store/products"
    navigate(path);
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl shadow-lg  hover:shadow-2xl transform transition-all duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        📦 Manage Inventory
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Quantity Available
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Warehouse Location
          </label>
          <input
            type="text"
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Minimum Stock Alert
          </label>
          <input
            type="number"
            value={minimumStock}
            onChange={(e) => setMinimumStock(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-medium shadow-md hover:bg-blue-600 active:scale-95 transition-transform duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
