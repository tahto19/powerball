//@ts-nocheck

import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import { getToken } from "@/redux/reducers/token/asyncCalls";
import { userLogout } from "@/redux/reducers/token/asyncCalls";

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate()
  const { token, loading, doneLoading } = useAppSelector(
    (state) => state.token
  ); // Check if token exists
  const userDetails = useAppSelector((state: RootState) => state.user);

  if (!token) {
    // Save the path the user was trying to access
    localStorage.setItem("pb_paths", location.pathname);
  }


  useEffect(() => {
    if (!token) {
      console.log("sing-in")
      navigate("sign-in")
    }
  }, [token]);

  useEffect(() => {
    if (token && !userDetails.isAdmin) {
      dispatch(userLogout())
    }
  }, [token, userDetails]);


  return !doneLoading ? (
    <>..loading</>
  ) : token && userDetails.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" replace />
  );
};

export default ProtectedRoute;
