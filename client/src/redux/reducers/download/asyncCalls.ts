import { RootState } from "@/redux/store";
import apiService from "@/services/apiService";
import { exportDataState } from "@/types/allTypes";
import { base64ToFile, delay, getMessage } from "@/utils/util";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";

export const downloadData = createAsyncThunk(
  "exportData/downloadData",
  async (data: exportDataState, { getState }) => {
    const toastId = toast.loading("Waiting For Response");
    await delay(1000);
    try {
      const state = getState() as RootState;

      const token = state.token.token;
      const title = state.exportData.title;
      const _r = await apiService.exportData(data, token ? token : "test");
      let file = _r.file;

      toast.update(toastId, {
        render: "Downloading...",
        type: "info",
        isLoading: true,
        autoClose: 2000,
      });
      await delay(1000);
      console.log(data);
      await base64ToFile(
        file,
        `${title}-date:${moment().format("MMMM DD YYYY")}`
      );
      toast.update(toastId, {
        render: "Download Complete!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err: unknown) {
      let m = getMessage(err);
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data?.message;

        toast.update(toastId, {
          render: "Error Download!: " + m,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else if (err instanceof Error) {
        let message = toast.update(toastId, {
          render: "Error Download Complete!: " + m,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  }
);
