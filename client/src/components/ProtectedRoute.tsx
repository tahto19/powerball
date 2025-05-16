//@ts-nocheck

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import { getToken } from "@/redux/reducers/token/asyncCalls";

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { token, loading, doneLoading } = useAppSelector(
    (state) => state.token
  ); // Check if token exists

  if (!token) {
    // Save the path the user was trying to access
    localStorage.setItem("pb_paths", location.pathname);
  }

  useEffect(() => {
    dispatch(getToken());
  }, [token]);

  return !doneLoading ? (
    <>..loading</>
  ) : token ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" replace />
  );
};

export default ProtectedRoute;
