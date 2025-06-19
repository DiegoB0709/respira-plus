import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "./context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
  const { loading, isAuthenticated, user } = useAuth();
  if (loading) return <h1>Loading...</h1>;
  if (!loading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return (
    <Outlet/>
  )
}

export default ProtectedRoute