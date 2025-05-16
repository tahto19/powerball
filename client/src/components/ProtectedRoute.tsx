//@ts-nocheck

import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import { getToken } from "@/redux/reducers/token/asyncCalls";
import { getUser } from "@/redux/reducers/user/asnycCalls";
import { RootState } from "@/redux/store";

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const nav = useNavigate();

  const userDetails = useAppSelector((state: RootState) => state.user);
  const { token, loading, doneLoading } = useAppSelector(
    (state) => state.token
  ); // Check if token exists


  useEffect(() => {
    dispatch(getToken());
    if (token) {
      dispatch(
        getUser()
      )
      // Save the path the user was trying to access
      localStorage.setItem("pb_paths", location.pathname);
    }
  }, [token, location.pathname]);
  useEffect(() => {
    console.log(token)
    console.log(doneLoading)
    console.log("====", !userDetails.isAdmin)

  }, [doneLoading, userDetails, token])
  // useEffect(() => {
  //   console.log(token)
  //   if (!doneLoading || !token || !userDetails.loading || !userDetails.isAdmin) {
  //     nav("/sign-in")
  //   } 
  //   else {
  //     const redirectPath = localStorage.getItem("pb_paths") || "/prize-list";
  //     localStorage.removeItem("pb_paths"); // clean it up
  //     nav(redirectPath);
  //   }
  // }, [doneLoading, userDetails, token])

  if (!doneLoading) return <>..loading</>;
  if (!doneLoading && !token) return <Navigate to="/sign-in" replace />;
  if (!token && !userDetails.isAdmin) return <Navigate to="/sign-in" replace />;

  return <Outlet />
};

export default ProtectedRoute;
