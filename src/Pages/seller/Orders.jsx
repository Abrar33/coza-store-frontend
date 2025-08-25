import { useEffect, useRef, useState } from 'react';
import { Search, Filter, MoreHorizontal, Edit, Trash2, Ban } from 'lucide-react';
import { getBuyerOrders, getSellerOrders, getAllOrders } from '../../services/OrdersServices'; // ⭐️ Import the new function
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const Orders = ({ darkMode }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [role, setRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const dropdownRefs = useRef([]);
  const navigate = useNavigate();

  const textColor = darkMode ? 'text-white' : 'text-gray-800';
  const subTextColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const borderColor = darkMode ? 'border-gray-600' : 'border-gray-200';
  const inputRing = darkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-500';

  useEffect(() => {
    const loadRole = () => {
      const authUser = JSON.parse(localStorage.getItem('authUser'));
      if (authUser?.role) {
        setRole(authUser.role);
      } else {
        setTimeout(loadRole, 200);
      }
    };
    loadRole();
  }, []);

  useEffect(() => {
    if (!role) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        let fetchedOrders;
        if (role === 'admin') { // ⭐️ New condition for admin
          fetchedOrders = await getAllOrders(); 
        } else if (role === 'buyer') {
          fetchedOrders = await getBuyerOrders();
        } else if (role === 'seller') {
          fetchedOrders = await getSellerOrders();
        }
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openIndex !== null && dropdownRefs.current[openIndex] && !dropdownRefs.current[openIndex].contains(event.target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openIndex]);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      order?.customerInfo?.name?.toLowerCase().includes(searchLower) ||
      order?.customerInfo?.email?.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  if (loading || !role) {
    return <div className={`text-center py-10 ${subTextColor}`}>Loading orders...</div>;
  }

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textColor}`}>Order Management</h2>
          <p className={`text-sm ${subTextColor}`}>Track and manage all customer orders.</p>
        </div>
      </div>

      <div className={`p-4 rounded-xl border transition-transform duration-200 ${borderColor} hover:scale-[1.02]`}>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-grow">
            <Search className={`absolute left-3 top-2.5 w-5 h-5 ${subTextColor}`} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search by order ID, name, or email..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none ${inputRing} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border ${borderColor}`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg text-sm border ${borderColor} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none ${inputRing}`}
          >
            {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className={`p-4 rounded-xl border transition-transform duration-200 hover:scale-[1.02] ${borderColor}`}>
          <h3 className={`text-lg font-semibold mb-3 ${textColor}`}>Recent Orders</h3>
          <div className="overflow-x-auto p-4">
            <div className={`min-w-[900px] divide-y ${borderColor} border ${borderColor} rounded-xl`}>
              <div className={`flex px-4 py-3 font-semibold text-sm ${subTextColor}`}>
                <div className="w-[12%]">Order ID</div>
                <div className="w-[20%]">Customer</div>
                <div className="w-[12%]">Status</div>
                <div className="w-[12%]">Amount</div>
                <div className="w-[12%]">Items</div>
                <div className="w-[15%]">Date</div>
                <div className="w-[17%] text-right">Actions</div>
              </div>

              {filteredOrders.map((order, idx) => {
                const statusColor =
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700';

                return (
                  <div
                    key={order._id}
                    className={`flex items-center px-4 py-8 text-sm transition-transform duration-200 ${hoverBg} ${cardBg} hover:scale-[1.01]`}
                  >
                    <div className="w-[12%]">{order._id.substring(order._id.length - 6)}</div>
                    <div className="w-[20%]">
                      <p className={`font-medium ${textColor}`}>{order?.customerInfo?.name}</p>
                      <p className={`text-xs ${subTextColor}`}>{order?.customerInfo?.email}</p>
                    </div>
                    <div className="w-[12%]">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="w-[12%]">${order.totalAmount.toFixed(2)}</div>
                    <div className="w-[12%]">{order.items.length}</div>
                    <div className="w-[15%]">{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="w-[17%] relative flex justify-end" ref={(el) => (dropdownRefs.current[idx] = el)}>
                      <button
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className={`p-2 rounded-full relative z-10 ${hoverBg} ${textColor}`}
                      >
                        <MoreHorizontal />
                      </button>

                      {openIndex === idx && (
                        <div
                          className={`absolute z-50 -bottom-10 right-0 w-44 rounded-md border ${borderColor} shadow-lg ${
                            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                          }`}
                        >
                          <button
                            onClick={() => navigate(`/seller-store/orders/${order._id}`)}
                            className={`w-full px-4 py-2 flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-600 ${textColor}`}
                          >
                            <Edit className="w-4 h-4" /> View Details
                          </button>
                          {role === 'admin' && (
                            <>
                              <button className={`w-full px-4 py-2 flex items-center gap-2 hover:bg-yellow-100 dark:hover:bg-yellow-600 ${textColor}`}>
                                <Ban className="w-4 h-4" /> Suspend
                              </button>
                              <button className={`w-full px-4 py-2 flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-600 ${textColor}`}>
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className={`text-center py-10 ${subTextColor}`}>
          No matching orders found.
        </div>
      )}
    </div>
  );
};

export default Orders;