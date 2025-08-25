// hooks/useAuth.js
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    token: null,
    user: null // Add a user object to the state
  });

  useEffect(() => {
    const stored = localStorage.getItem('authUser');
    if (stored) {
      // Destructure name and email from the stored data
      const { token, role, name, email, expiry } = JSON.parse(stored);
      
      if (Date.now() < expiry) {
        setAuth({ 
          isAuthenticated: true, 
          role, 
          token, 
          user: { name, email } // Set the user object
        });
      } else {
        localStorage.removeItem('authUser'); // Expired token
      }
    }
  }, []);

  return auth;
};

export default useAuth;