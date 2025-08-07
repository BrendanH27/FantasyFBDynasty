import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/authcontext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
