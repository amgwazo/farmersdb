import React from "react";
import { Route, Navigate } from "react-router-dom";

// Assuming you have some logic to check if the user is authenticated and their role
const isAuthenticated = true; // Replace with your authentication logic
const userRole = "user"; // Replace with the user's role

const PrivateRoute = ({ path, element, roles }) => {
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(userRole)) {
    // Redirect to unauthorized page if roles are specified and user role doesn't match
    return <Navigate to="/unauthorized" />;
  }

  // Render the component if authenticated and roles match
  return <Route path={path} element={element} />;
};

export default PrivateRoute;
