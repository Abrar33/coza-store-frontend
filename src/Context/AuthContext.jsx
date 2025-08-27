// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser({
        token: parsed.token,
        role: parsed.role,
        id: parsed.id || parsed._id || parsed.uid, // normalize id
      });
    }
  }, []);
console.log('auth user',user)
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
