import { RootState } from "@/redux/store";
import apiService from "@/services/apiService";
import { exportDataState } from "@/types/allTypes";
import { base64ToFile, bodyDecrypt } from "@/utils/util";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const downloadData = createAsyncThunk(
  "exportData/downloadData",
  async (data: exportDataState, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.token.token;

    const _r = await apiService.exportData(data, token ? token : "test");
    let file = _r.file;
    console.log(_r);
    await base64ToFile(file, "test");

    try {
    } catch (err) {}
  }
);
