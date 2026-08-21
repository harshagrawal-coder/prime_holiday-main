import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "../components/ui/PageLoader";

const AuthRedirect = ({
  user,
  loading,
  redirectTo,
  requiredRole,
}) => {
  // Auth state is still loading
  if (loading) {
    return <PageLoader />;
  }

  // User is not logged in
  // Allow access to login/register page
  if (!user) {
    return <Outlet />;
  }

  // User is logged in but doesn't have required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // User is already logged in
  return <Navigate to={redirectTo} replace />;
};

export default AuthRedirect;