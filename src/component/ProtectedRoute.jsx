import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, activeRoles }) => {
  const fakeUserRoles = [];
  const hasAccess = fakeUserRoles.some((role) => activeRoles.includes(role));
  return hasAccess ? children : <Navigate to="/authentication/login" replace />;
};

export default ProtectedRoute;
