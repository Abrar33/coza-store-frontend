import React, { useEffect, useState, useRef } from 'react';
import ProductCard from '../../Components/ProductCard';
import { deleteProduct, getAllProductsAdmin, getAllSellers, getSellerProducts, handleApprove, handleReject } from '../../services/productService';
import gsap from 'gsap';
import { Filter, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductManagement = ({ darkMode, isAdmin }) => {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const filterPanelRef = useRef(null);
  const filterButtonRef = useRef(null);

  const textColor = darkMode ? 'text-white' : 'text-gray-800';
  const subTextColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-600' : 'border-gray-200';
  const inputRing = darkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-500';

  const navigate = useNavigate();

  // ✅ Delete product - This function is shared
  const handleDelete = async (productId) => {
    try {
      const response = await deleteProduct(productId);
      if (response.message) {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("An error occurred while deleting");
    }
  };

  // ✅ Approve product - Only for admin
  const handleApproveClick = async (product) => {
    try {
      await handleApprove(product);
      setProducts(prev =>
        prev.map(p =>
          p._id === product._id ? { ...p, status: "approved" } : p
        )
      );
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  // ✅ Reject product - Only for admin
  const handleRejectClick = async (product) => {
    try {
      await handleReject(product);
      setProducts(prev =>
        prev.map(p =>
          p._id === product._id ? { ...p, status: "rejected" } : p
        )
      );
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  const handleCreateProduct = () => {
    navigate(isAdmin ? '/admin-dashboard/create-product' : '/seller-store/create-product');
  };

  const handleFilterSeller = (sellerId) => {
    setSelectedSeller(sellerId === selectedSeller ? null : sellerId);
    setIsFilterPanelOpen(false);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        let productsRes;
        let sellersRes;

        if (isAdmin) {
          [productsRes, sellersRes] = await Promise.all([
            getAllProductsAdmin(),
            getAllSellers()
          ]);
          if (Array.isArray(sellersRes)) setSellers(sellersRes);
        } else {
          productsRes = await getSellerProducts();
        }

        if (Array.isArray(productsRes)) setProducts(productsRes);
        else console.error('Invalid product response:', productsRes);

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
    
    // Cleanup for filter panel
    const handleClickOutside = (event) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setIsFilterPanelOpen(false);
      }
    };
    if (isAdmin) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      if (isAdmin) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [isAdmin]);

  useEffect(() => {
    if (isFilterPanelOpen && filterPanelRef.current) {
      gsap.fromTo(
        filterPanelRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 }
      );
    }
  }, [isFilterPanelOpen]);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(headerRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
      gsap.fromTo(gridRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 });
    }
  }, [loading]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product?.tags?.some(tag => tag?.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesSeller = isAdmin && selectedSeller ? product.seller?._id === selectedSeller : true;

    return matchesSearch && matchesSeller;
  });

  return (
    <section className="max-w-screen-xl mx-auto px-6 py- space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div ref={headerRef}>
          <h2 className={`text-2xl font-bold ${textColor}`}>Product Management</h2>
          <p className={`text-sm ${subTextColor}`}>Manage your product catalog, inventory, and pricing.</p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg bg-gradient-to-r from-blue-700 to-pink-500 hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          Create Product
        </button>
      </div>

      {/* Search & Filter */}
      <div className={`p-4 rounded-xl border transition-transform duration-200 hover:scale-[1.02] ${borderColor} relative z-40`}>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-grow">
            <Search className={`absolute left-3 top-2.5 w-5 h-5 ${subTextColor}`} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search by name, category, or tag..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 ${inputRing} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border ${borderColor}`}
            />
          </div>
          
          {/* Admin-only Filter Button */}
          {isAdmin && (
            <div className="relative">
              <button
                ref={filterButtonRef}
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-lg transition-transform duration-200 hover:scale-105 ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'} ${borderColor} ${isFilterPanelOpen ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>

              {isFilterPanelOpen && (
                <div
                  ref={filterPanelRef}
                  className={`absolute z-50 mt-4 p-4 rounded-lg shadow-lg w-64 right-0 ${cardBg} ${borderColor} border`}
                >
                  <h4 className={`font-semibold mb-2 ${textColor}`}>Filter by Seller</h4>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    <li
                      role="button"
                      tabIndex={0}
                      onClick={() => handleFilterSeller(null)}
                      className={`cursor-pointer p-2 rounded-lg ${selectedSeller === null ? 'bg-blue-500 text-white' : `hover:bg-gray-100 dark:hover:bg-gray-700 ${textColor}`}`}
                    >
                      All Sellers
                    </li>
                    {sellers.map(seller => (
                      <li
                        key={seller._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleFilterSeller(seller._id)}
                        className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg ${selectedSeller === seller._id ? 'bg-blue-500 text-white' : `hover:bg-gray-100 dark:hover:bg-gray-700 ${textColor}`}`}
                      >
                        {seller.avatar ? (
                          <img src={seller.avatar} alt={seller.name} className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                            {seller.name?.charAt(0)}
                          </div>
                        )}
                        {seller.name}
                      </li>
                    ))}
                  </ul>
                  {selectedSeller && (
                    <button
                      onClick={() => handleFilterSeller(null)}
                      className="text-sm text-blue-600 hover:underline mt-2"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Product Grid */}
      {loading ? (
        <p className="text-center text-blue-500 mt-6">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No products found. Start by adding some!</p>
      ) : (
        <div ref={gridRef} className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              darkMode={darkMode}
              handleDelete={() => handleDelete(product._id)}
              handleApprove={isAdmin ? handleApproveClick : null}
              handleReject={isAdmin ? handleRejectClick : null}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductManagement;