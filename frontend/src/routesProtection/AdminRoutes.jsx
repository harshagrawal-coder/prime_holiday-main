import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "../components/ui/PageLoader";
const AdminRoute = ({ user, loading }) => {
  console.log("loading ", loading);

  if (loading) {
    return <PageLoader />;
  }  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }  if (user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
