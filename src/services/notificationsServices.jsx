import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';
import axios from 'axios';

// Realtime subscribe to notifications for a user


export const subscribeNotifications = (userId, userRole, callback, errorCallback) => {
  try {
    let q;
console.log("Subscribing with:", userId, userRole);
  if (userRole === "admin") {
  // ✅ Admin only sees notifications targeted to admins
  q = query(
    collection(db, "notifications"),
    where("recipientRole", "==", "admin"),

  );
} else {
  // ✅ Users/Sellers only see their own notifications
  q = query(
    collection(db, "notifications"),
    where("recipientId", "==", userId),
    orderBy("createdAt", "desc")
  );
}

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(notifs);
      },
      (err) => {
        console.error("Notification subscribe error:", err);
        errorCallback(err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error("Notification subscribe setup failed:", err);
    errorCallback(err);
  }
};


// ... (rest of your functions) ...

// Mark notification as read via backend API
export const markAsRead = async (id) => {
    if (!id) throw new Error('Notification ID is required');

    const token = JSON.parse(localStorage.getItem('authUser'))?.token;
    return axios.patch(
        `http://localhost:3000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

// Mark all notifications as read via backend API
export const markAllAsRead = async () => {
    const token = JSON.parse(localStorage.getItem('authUser'))?.token;
    return axios.patch(
        `http://localhost:3000/api/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

// Delete notification via backend API
export const deleteNotification = async (id) => {
    const token = JSON.parse(localStorage.getItem('authUser'))?.token;
    return axios.delete(`http://localhost:3000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};