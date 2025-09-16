import { RootState } from "@/redux/store";
import apiService from "@/services/apiService";
import { exportDataState } from "@/types/allTypes";
import { base64ToFile, delay, getMessage } from "@/utils/util";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast, TypeOptions } from "react-toastify";
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
      let type: TypeOptions = m === "No Data" ? "info" : "error";
      if (axios.isAxiosError(err)) {
        toast.update(toastId, {
          render: m !== "No Data" ? "Error Download!: " + m : "" + m,
          type: type,
          isLoading: false,
          autoClose: 2000,
        });
      } else if (err instanceof Error) {
        toast.update(toastId, {
          render: m === "No Data" ? "Error Download Complete!: " + m : "" + m,
          type: type,
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  }
);
