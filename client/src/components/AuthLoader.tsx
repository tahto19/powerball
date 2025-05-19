//@ts-nocheck

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import { getToken } from "@/redux/reducers/token/asyncCalls";
import { getUser } from "@/redux/reducers/user/asnycCalls";

const ProtectedRoute = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const userDetails = useAppSelector((state: RootState) => state.user);

    const { token, loading, doneLoading } = useAppSelector(
        (state) => state.token
    ); // Check if token exists

    //   if (!token) {
    //     // Save the path the user was trying to access
    //     localStorage.setItem("pb_paths", location.pathname);
    //   }

    useEffect(() => {
        if (token) {
            dispatch(
                getUser()
            )
        }
    }, [token])

    useEffect(() => {
        dispatch(getToken());
    }, [token]);

    return !doneLoading ? (
        <>..loading</>
    ) : <Outlet />
};

export default ProtectedRoute;
