import { useEffect, useRef, useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash2, Ban } from 'lucide-react';

const users = [
  {
    name: 'Abrar Ahmed',
    email: 'abrar@example.com',
    role: 'Seller',
    status: 'Active',
    orders: 45,
    joined: '2024-11-03',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Buyer',
    status: 'Inactive',
    orders: 12,
    joined: '2023-08-14',
  },
];

const Users = ({ darkMode }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRefs = useRef([]);

  const textColor = darkMode ? 'text-white' : 'text-gray-800';
  const subTextColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const borderColor = darkMode ? 'border-gray-600' : 'border-gray-200';
  const inputRing = darkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-500';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRefs.current[openIndex] && !dropdownRefs.current[openIndex].contains(event.target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openIndex]);

  return (
    <div className={`w-full p-4 md:p-6 rounded-2xl border ${borderColor}`}>
      {/* Top Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textColor}`}>User Management</h2>
          <p className={`text-sm ${subTextColor}`}>Manage your customers and their account settings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg bg-gradient-to-r from-blue-700 to-pink-500 hover:opacity-90 transition">
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 w-full">
        <div className="relative flex-grow">
          <Search className={`absolute left-3 top-2.5 w-5 h-5 ${subTextColor}`} />
          <input
            type="text"
            placeholder="Search users..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none ${inputRing} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border ${borderColor}`}
          />
        </div>
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-lg transition ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'} ${borderColor}`}
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Section Title */}
      <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>All Users</h3>

      {/* Scrollable Table */}
      <div className="overflow-x-auto">
        <div className={`min-w-[700px] divide-y ${borderColor} border ${borderColor} rounded-xl`}>
          {/* Headers */}
          <div className={`flex px-4 py-3 font-semibold text-sm ${subTextColor}`}>
            <div className="w-1/5">Name</div>
            <div className="w-1/6">Role</div>
            <div className="w-1/6">Status</div>
            <div className="w-1/6">Orders</div>
            <div className="w-1/6">Joined</div>
            <div className="w-1/6">Actions</div>
          </div>

          {/* Rows */}
          {users.map((user, idx) => (
            <div
              key={idx}
              className={`flex items-center px-4 py-4 text-sm ${hoverBg} ${cardBg}`}
            >
              {/* Name */}
              <div className="w-1/5">
                <p className={`font-medium ${textColor}`}>{user.name}</p>
                <p className={`text-xs ${subTextColor}`}>{user.email}</p>
              </div>

              {/* Role */}
              <div className="w-1/6">{user.role}</div>

              {/* Status */}
              <div className="w-1/6">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user.status}
                </span>
              </div>

              {/* Orders */}
              <div className="w-1/6">{user.orders}</div>

              {/* Joined */}
              <div className="w-1/6">{user.joined}</div>

              {/* Actions */}
              <div
                className="w-1/6 relative flex justify-end"
                ref={(el) => (dropdownRefs.current[idx] = el)}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full relative z-10"
                >
                  <MoreHorizontal />
                </button>

                {openIndex === idx && (
                  <div
                    className={`absolute z-50 -top-14 right-0 w-44 rounded-md border ${borderColor} shadow-lg ${
                      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}
                  >
                    <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-600">
                      <Edit className="w-4 h-4" /> Edit User
                    </button>
                    <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-yellow-100 dark:hover:bg-yellow-600">
                      <Ban className="w-4 h-4" /> Suspend
                    </button>
                    <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-600">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
