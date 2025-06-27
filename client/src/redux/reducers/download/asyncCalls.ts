import { RootState } from "@/redux/store";
import apiService from "@/services/apiService";
import { exportDataState } from "@/types/allTypes";
import { base64ToFile, delay } from "@/utils/util";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import { toast } from "react-toastify";
import axios from "axios";

export const downloadData = createAsyncThunk(
  "exportData/downloadData",
  async (data: exportDataState, { dispatch, getState }) => {
    const toastId = toast.loading("Waiting For Response");
    await delay(1000);
    try {
      const state = getState() as RootState;
      const token = state.token.token;

      const _r = await apiService.exportData(data, token ? token : "test");
      let file = _r.file;

      toast.update(toastId, {
        render: "Downloading...",
        type: "info",
        isLoading: true,
        autoClose: 2000,
      });
      await delay(1000);
      await base64ToFile(file, "test");
      toast.update(toastId, {
        render: "Download Complete!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data?.message;
        console.log(responseData);
        toast.update(toastId, {
          render: "Error Download!: " + responseData,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else if (err instanceof Error) {
        toast.update(toastId, {
          render: "Error Download Complete!: " + err.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  }
);
