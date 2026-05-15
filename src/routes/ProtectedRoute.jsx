import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext); // Assuming you have a loading state in context
  const location = useLocation();

  // 1. LOADING STATE
  // Prevents the "Flash of Login Page" while checking tokens/auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. AUTHENTICATION CHECK
  if (!user) {
    // Redirect to login, but save the current location so we can send them back after they log in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. ROLE AUTHORIZATION
  const userRole = (user?.role || user?.accountType)?.toLowerCase();

  if (role) {
    const allowedRoles = Array.isArray(role) 
      ? role.map(r => r.toLowerCase()) 
      : [role.toLowerCase()];

    if (!allowedRoles.includes(userRole)) {
      // If user is logged in but doesn't have the right role, 
      // send them to the home page or an "Unauthorized" page
      return <Navigate to="/" replace />;
    }
  }

  // 4. ACCESS GRANTED
  return children;
};

export default ProtectedRoute;