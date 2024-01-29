import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  //   return allowedRoles?.includes(auth?.roles) ? (
  // return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
  
  // Split auth.roles into an array of roles
  const userRoles = auth?.roles ? auth.roles.split(",") : [];

  // Check if any of the user's roles match the allowed roles
  const hasMatchingRole = allowedRoles.some((role) => userRoles.includes(role));

  return hasMatchingRole ? (
    <Outlet />
  ) : auth?.userData ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
