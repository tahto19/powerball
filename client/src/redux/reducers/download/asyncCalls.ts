import { RootState } from "@/redux/store";
import apiService from "@/services/apiService";
import { exportDataState } from "@/types/allTypes";
import { base64ToFile, delay } from "@/utils/util";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import { toast } from "react-toastify";

export const downloadData = createAsyncThunk(
  "exportData/downloadData",
  async (data: exportDataState, { dispatch, getState }) => {
    const toastId = toast.loading("Loading...");
    await delay(5000);
    try {
      const state = getState() as RootState;
      const token = state.token.token;

      console.log(">>>", data);
      const _r = await apiService.exportData(data, token ? token : "test");
      let file = _r.file;

      toast.update(toastId, {
        render: "Downloading!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      await delay(5000);
      await base64ToFile(file, "test");
      toast.update(toastId, {
        render: "Download Complete!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.update(toastId, {
          render: "Error Download Complete!: " + err.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  }
);
