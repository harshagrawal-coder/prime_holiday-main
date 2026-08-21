import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import PageLoader from "../components/ui/PageLoader";
const ProtectedRoute = ({ user, loading }) => {
  const location = useLocation();
  if (loading) {
    return <PageLoader />;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
};
export default ProtectedRoute;
