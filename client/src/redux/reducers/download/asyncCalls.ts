import { RootState } from "@/redux/store";
import apiService from "@/services/apiService";
import { exportDataState } from "@/types/allTypes";
import { base64ToFile } from "@/utils/util";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";

export const downloadData = createAsyncThunk(
  "exportData/downloadData",
  async (data: exportDataState, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.token.token;
    dispatch(
      showToaster({
        message: "Downloading...",
        variant: "info",
        icon: "info",
      })
    );
    const _r = await apiService.exportData(data, token ? token : "test");
    let file = _r.file;
    dispatch(
      showToaster({
        message: "Done Loading",
        variant: "info",
        icon: "info",
      })
    );
    await base64ToFile(file, "test");

    try {
    } catch (err) {}
  }
);
