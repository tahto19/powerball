import { exportDataState } from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
import { downloadData } from "./asyncCalls";

const initialState: exportDataState = {
  type: 1,
  date_range: undefined,
  loading: false,
};

const exportData = createSlice({
  name: "exportData",
  initialState,
  reducers: {
    download: (state) => {
      state.loading = true;
    },
    doneLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (d) => {
    d.addCase(downloadData.pending, (state) => {
      state.loading = true;
    });
    d.addCase(downloadData.fulfilled, (state) => {
      state.loading = false;
    });
  },
});
