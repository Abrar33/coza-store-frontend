import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Users = ({ darkMode }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRefs = useRef({});

  // Fetch users once when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const authUserString = localStorage.getItem('authUser');
        if (!authUserString) {
          setError('You must be logged in as an admin to view users.');
          return;
        }

        const authUser = JSON.parse(authUserString);
        const token = authUser?.token;
        const role = authUser?.role;

        if (!token || role !== 'admin') {
          setError('You must be logged in as an admin to view users.');
          return;
        }

        const { data } = await axios.get(
          'http://localhost:3000/api/admin/users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedUsers = data.map((user) => ({
          _id: user._id,
          name: user.name || user.email,
          email: user.email,
          role: user.role,
          status: user.status || 'Active',
          products:
            user.role === 'seller'
              ? user.associatedData?.length || 0
              : null,
          orders:
            user.role === 'buyer'
              ? user.associatedData?.length || 0
              : null,
          joined: new Date(user.createdAt).toLocaleDateString(),
        }));

        setAllUsers(formattedUsers);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to fetch users.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openIndex !== null &&
        dropdownRefs.current[openIndex] &&
        !dropdownRefs.current[openIndex].contains(event.target)
      ) {
        setOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openIndex]);

  if (loading) {
    return (
      <div
        className={`p-4 text-center ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 text-center text-red-500 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className={`p-4 ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead
            className={`${
              darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Products</th>
              <th className="px-4 py-2 text-left">Orders</th>
              <th className="px-4 py-2 text-left">Joined</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, index) => (
              <tr
                key={user._id}
                className={`${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.status}</td>
                <td className="px-4 py-2">{user.products ?? '-'}</td>
                <td className="px-4 py-2">{user.orders ?? '-'}</td>
                <td className="px-4 py-2">{user.joined}</td>
                <td className="px-4 py-2 relative">
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <MoreHorizontal />
                  </button>

                  {openIndex === index && (
                    <div
                      ref={(el) => (dropdownRefs.current[index] = el)}
                      className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg z-10 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      }`}
                    >
                      <ul className="py-1">
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          Edit
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          Suspend
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
