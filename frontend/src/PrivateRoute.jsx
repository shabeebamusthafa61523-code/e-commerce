import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly }) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && user.role !== "admin")
    return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
