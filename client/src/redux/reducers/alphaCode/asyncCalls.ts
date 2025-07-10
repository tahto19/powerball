import { RootState } from "@/redux/store";
import apiService from "@/services/apiService";
import { alphaCodeProps, getDataV2 } from "@/types/allTypes";
import { getMessage } from "@/utils/util";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { alphaCodeListAdd } from "./alphacodeSlice";

export const getAlphaCodeList = createAsyncThunk(
  "aplhaCode/getAlphaCode",
  async (data: getDataV2, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      let r = await apiService.getAlphaCode(data, token);

      let getGetDataV2 = !data.limit
        ? { limit: 10, sort: [], filter: [], offset: 0 }
        : data;

      let toDispatch = { ...getGetDataV2, ...r.list };
      dispatch(alphaCodeListAdd(toDispatch));
      console.log(toDispatch);
    } catch (err) {
      let message = getMessage(err);
      toast.error(`error: ${message}`, {
        type: "error",

        autoClose: 6000,
      });
    }
  }
);
export const postAlphaCode = createAsyncThunk(
  "aplhaCode/postAlphaCode",
  async (data: alphaCodeProps, { dispatch, getState }) => {
    let tId = toast("Adding Alpha Code", {
      isLoading: true,
      hideProgressBar: false,
    });
    try {
      const state = getState() as RootState;
      const token = state.token.token;

      console.log(data);
      let r = await apiService.postAlphaCode(data, token);
      if (r.data.result === "error") throw new Error(r.data.message);
      toast.update(tId, {
        type: "success",
        render: "successfully added",
        isLoading: false,
        hideProgressBar: true,
      });
      dispatch(
        getAlphaCodeList({
          limit: 10,
          sort: [],
          filter: [],
          offset: 0,
          location: null,
        })
      );
    } catch (err) {
      let message = getMessage(err);
      toast.update(tId, {
        type: "error",
        render: message,
        isLoading: false,
        hideProgressBar: true,
      });
    }
  }
);
export const putAlphaCode = createAsyncThunk(
  "aplhaCode/putAlphaCode",
  async (data: alphaCodeProps, { dispatch, getState }) => {
    let tId = toast("Editing Alpha Code", {
      isLoading: true,
      hideProgressBar: false,
    });
    try {
      const state = getState() as RootState;
      const token = state.token.token;

      console.log(data);
      let r = await apiService.putAlphaCode(data, token);
      if (r.data.result === "error") throw new Error(r.data.message);
      toast.update(tId, {
        type: "success",
        render: "successfully Edited",
        isLoading: false,
        hideProgressBar: true,
      });
      dispatch(
        getAlphaCodeList({
          limit: 10,
          sort: [],
          filter: [],
          offset: 0,
          location: null,
        })
      );
    } catch (err) {
      let message = getMessage(err);
      toast.update(tId, {
        type: "error",
        render: message,
        isLoading: false,
        hideProgressBar: true,
      });
    }
  }
);
