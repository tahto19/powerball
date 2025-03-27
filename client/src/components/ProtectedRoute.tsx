import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import { getToken } from "@/redux/reducers/token/asyncCalls";

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const { token, loading, doneLoading } = useAppSelector(
    (state) => state.token
  ); // Check if token exists
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
