// Components/ProtectedRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const authData = JSON.parse(localStorage.getItem('authUser'));

  if (!authData) {
    return <Navigate to="/" replace />;
  }

  const { token, role, expiry } = authData;

  // Check token expiry
  if (Date.now() > expiry) {
    localStorage.removeItem('authUser');
    return <Navigate to="/" replace />;
  }

  // Check role
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
