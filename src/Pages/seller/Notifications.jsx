import { useNotifications } from '../../Context/notificationsContext';
import { markAsRead, deleteNotification, markAllAsRead } from '../../services/notificationsServices';
import { Bell, EyeOff, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
const NotificationPanel = ({ darkMode }) => {
  const { notifications, loading, error, reload,  } = useNotifications(); // ✅ Added user to access role
  const [activeTab, setActiveTab] = useState('All');
  // const[role,setRole]=useState()
  const navigate = useNavigate();

  const isUnread = (n) => !n.seen;

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      reload();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDelete = async (n) => {
    try {
      await deleteNotification(n.id);
      reload();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      reload();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };
  
// useEffect(() => {
//     const loadRole = () => {
//       const authUser = JSON.parse(localStorage.getItem('authUser'));
//       if (authUser?.role) {
//         setRole(authUser.role);
//       } else {
//         setTimeout(loadRole, 200);
//       }
//     };
//     loadRole();
//   }, []);
  const {role}=useAuth()
console.log(role)
  const handleNotificationClick = async (notification) => {
    console.log("notif", notification);
    if (isUnread(notification)) {
      await handleMarkRead(notification.id);
    }

    // ✅ Determine the correct base path based on user role
    const basePath = role === 'admin' ? '/admin-dashboard' : '/seller-store';

    switch (notification.type) {
      case 'orders':
        // Assuming your order notifications have an 'orderId' property
        if (notification.meta && notification.meta.orderId) {
          navigate(`${basePath}/orders/${notification.meta.orderId}`);
        }
        break;
      case 'products':
      case 'inventory':
        // Handle product-related notifications (e.g., product approval, low stock)
        // Assuming they have a 'productId' property
        if (notification.productId) {
          console.log(notification)
          navigate(`${basePath}/product/${notification.productId}`);
        }
        break;
      case 'users':
        // Assuming your user notifications have a 'userId' property
        if (notification.userId) {
          navigate(`${basePath}/users/${notification.userId}`);
        }
        break;
      case 'system':
        // For system notifications, you might navigate to a general dashboard
        navigate(basePath);
        break;
      default:
        // Optional: Log an unhandled type or do nothing
        console.log('Unhandled notification type:', notification.type);
        break;
    }
  };

  const filteredNotifications =
    activeTab === 'All' ? notifications : notifications.filter(n => n.type === activeTab.toLowerCase());

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className={darkMode ? 'bg-gray-900 text-white p-4 rounded' : 'bg-white p-4 rounded shadow'}>
      <div className="flex justify-between items-center mb-3 ">
        <h3 className="text-lg font-semibold flex items-center gap-2 relative">
          <Bell />
          Notifications
          {notifications.some(isUnread) && (
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-red-600 text-white rounded-full">
              {notifications.filter(isUnread).length}
            </span>
          )}
        </h3>
        <button
          onClick={handleMarkAllRead}
          className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Mark All Read
        </button>
      </div>

      <div className="m-3 flex gap-2 ">
        {['All', 'Orders', 'Users', 'Inventory', 'System'].map(tab => (
          <button
            key={tab}
            className={`px-3 py-1 rounded ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredNotifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="space-y-3 max-h-auto overflow-y-auto">
          {filteredNotifications.map(n => (
            <li
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3 rounded border cursor-pointer ${
                isUnread(n) ? 'font-bold bg-yellow-100 dark:bg-gray-700' : ''
              } flex justify-between items-center`}
            >
              <div>
                <div>{n.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{n.message}</div>
              </div>
              <div className="flex gap-2 items-center">
                {isUnread(n) && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleMarkRead(n.id);
                    }}
                    title="Mark as read"
                    className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    <EyeOff className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(n);
                  }}
                  title="Delete"
                  className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-700"
                >
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
