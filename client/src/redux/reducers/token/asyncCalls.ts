import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { addToken, doneLoading_, startLoading_ } from "./tokenSlice";

export const getToken = createAsyncThunk(
  "token/getToken",
  async (_, { dispatch }) => {
    try {
      dispatch(startLoading_());
      const _r = await apiService.checkSession();
      if (!_r.data) throw new Error("Re-login");
      dispatch(addToken(_r.data));
      dispatch(doneLoading_());
    } catch (err) {
      dispatch(doneLoading_());
      // dispatch(
      //   showToaster({
      //     err,
      //     variant: "success",
      //     icon: "success",
      //   })
      // );
    }
  }
);

export const userLogout = createAsyncThunk(
  "token/userLogout",
  async (_, { dispatch }) => {
    try {
      dispatch(startLoading_());
       await apiService.logout();
      dispatch(addToken(null));
      dispatch(doneLoading_());
    } catch (err) {
      dispatch(doneLoading_());
      dispatch(
        showToaster({
          err,
          variant: "success",
          icon: "success",
        })
      );
    }
  }
);
