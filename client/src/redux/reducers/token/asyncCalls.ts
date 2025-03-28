import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { addToken } from "./tokenSlice";

export const getToken = createAsyncThunk(
  "token/getToken",
  async (_, { dispatch }) => {
    try {
      const _r = await apiService.checkSession();
      if (!_r.data) throw new Error("Re-login");
      dispatch(addToken(_r.data));
    } catch (err) {
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
