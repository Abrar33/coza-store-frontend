import { useState, useRef, useEffect } from 'react';
import { Edit, MoreHorizontal, Eye, Copy, Trash2, CheckCircle2, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, darkMode, handleDelete, handleApprove, handleReject, isAdmin }) => {
 const [openDropdown, setOpenDropdown] = useState(false);
 const dropdownRef = useRef(null);
 const navigate = useNavigate();
console.log(product)
const handleProductUpdate = (product) => {
    const basePath = isAdmin ? '/admin-dashboard' : '/seller-store';
    // ✅ Correctly pass the product object in the state
    navigate(`${basePath}/products/update-product/${product._id}`, { state: { product } });
  };

 useEffect(() => {
  const handleClickOutside = (e) => {
   if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
    setOpenDropdown(false);
   }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);
 
 const imageUrl = product?.variations?.find(v => Array.isArray(v.images) && v.images.length)?.images[0] ||
 '/placeholder.png';

 return (
  <div
   className={`w-full rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] group
    ${darkMode
     ? 'bg-gray-800 text-white hover:bg-gray-700 hover:shadow-[0_10px_25px_rgba(0,255,128,0.25)]'
     : 'bg-white text-gray-800 hover:bg-blue-50 hover:shadow-[0_10px_25px_rgba(59,130,246,0.25)]'}
   `}
  >
   {/* Image */}
   <img
    src={imageUrl}
    alt={product.name || 'Product Image'}
    className="w-full h-80 object-cover transition-opacity duration-300"
   />

   {/* Details */}
   <div className="p-4 space-y-1">
    <h3 className="text-lg font-semibold">{product.name || 'Product Name'}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{product.category || 'Category'}</p>

    <div className="flex items-center justify-between mt-2">
     <span className="text-xl font-bold">${product.price}</span>
     <span className={`text-sm font-medium text-white text-center px-2 py-1.5 rounded-full
      ${product.status === "pending" ? "bg-amber-400" : "bg-green-600"}`}>
      {product.status}
     </span>
    </div>

    <p className="text-sm text-gray-500 dark:text-gray-400">Stock: {product.stock} units</p>
   </div>

   {/* Bottom Action Bar */}
   <div
    className={`px-4 py-3 flex items-center justify-between border-t transition-colors duration-300
     ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
   >
    <button onClick={() => handleProductUpdate(product)} className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400">
     <Edit className="w-4 h-4" />
     Edit
    </button>

    {/* Dropdown */}
    <div className="relative" ref={dropdownRef}>
     <button
      onClick={() => setOpenDropdown(!openDropdown)}
      className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-700 hover:text-white'} transition`}
     >
      <MoreHorizontal className="w-5 h-5" />
     </button>

     {openDropdown && (
      <div
       className={`absolute z-50 bottom-0 right-0 mt-2 w-40 rounded-xl shadow-xl border
        ${darkMode
         ? 'bg-gray-800 border-gray-600 text-gray-200'
         : 'bg-white border-gray-200 text-gray-700'
        }`}
      >
       <button onClick={() => navigate(`${isAdmin ? '/admin-dashboard' : '/seller-store'}/product/${product._id}`)} className={`flex w-full items-center gap-2 px-4 py-2 ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-700 hover:text-white'}`}>
        <Eye className="w-4 h-4" />
        View Details
       </button>

       {isAdmin ? (
  product.seller?.role === "admin" ? (
    // Case 1: Admin’s own product → show Inventory + Reject
    <>
      <button
        onClick={() => navigate(`/admin-dashboard/inventory/${product._id}`)}
        className={`flex w-full items-center gap-2 px-4 py-2 ${
          darkMode ? "hover:bg-gray-500" : "hover:bg-gray-700 hover:text-white"
        }`}
      >
        <Copy className="w-4 h-4" />
        Inventory
      </button>
      <button
        onClick={() => handleReject(product)}
        className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400"
      >
        <Ban className="w-4 h-4" />
        Reject
      </button>
    </>
  ) : (
    // Case 2: Admin viewing a seller’s product → show Approve + Reject
    <>
      <button
        onClick={() => handleApprove(product)}
        className="flex w-full items-center gap-2 px-4 py-2 hover:bg-green-100 dark:hover:bg-green-700 text-green-600 dark:text-green-400"
      >
        <CheckCircle2 className="w-4 h-4" />
        Approve
      </button>
      <button
        onClick={() => handleReject(product)}
        className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400"
      >
        <Ban className="w-4 h-4" />
        Reject
      </button>
    </>
  )
) : (
  // Case 3: Logged-in Seller → show Inventory only
  <>
    <button
      onClick={() => navigate(`/seller-store/inventory/${product._id}`)}
      className={`flex w-full items-center gap-2 px-4 py-2 ${
        darkMode ? "hover:bg-gray-500" : "hover:bg-gray-700 hover:text-white"
      }`}
    >
      <Copy className="w-4 h-4" />
      Inventory
    </button>
  </>
)}

      </div>
     )}
    </div>
   </div>
  </div>
 );
};

export default ProductCard;