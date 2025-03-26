import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
    const token = Cookies.get("cookie_pb_1271"); // Check if token exists
    return token ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export default ProtectedRoute;