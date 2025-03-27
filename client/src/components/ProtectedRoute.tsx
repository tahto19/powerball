import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "@/redux/hook";

const ProtectedRoute = () => {
  const token = useAppSelector((state) => state.token.token); // Check if token exists
  return token ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;
