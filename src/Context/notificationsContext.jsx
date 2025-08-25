import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeNotifications } from '../services/notificationsServices';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
console.log(user)
 useEffect(() => {
  if (!user) return;

  setLoading(true);
  const unsubscribe = subscribeNotifications(
    user.id,    // ✅ consistent user ID
    user.role,  // ✅ role
    (data) => {
      setNotifications(data);
      setLoading(false);
    },
    (err) => {
      setError("Failed to load notifications");
      setLoading(false);
      console.error(err);
    }
  );

  return () => unsubscribe && unsubscribe();
}, [user?.id, user?.role]);
 // ✅ Add user.role to the dependency array

    const reload = () => {};

    return (
        <NotificationContext.Provider value={{ notifications, loading, error, reload }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);