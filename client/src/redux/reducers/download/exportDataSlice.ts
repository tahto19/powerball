import { exportDataState } from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
import { downloadData } from "./asyncCalls";

const initialState: exportDataState = {
  type: 1,
  date_range: undefined,
  loading: false,
  show: false,
  title: null,
  filter: [],
};

const exportDataSlice = createSlice({
  name: "exportData",
  initialState,
  reducers: {
    download: (state) => {
      state.loading = true;
    },
    doneLoading: (state) => {
      state.loading = false;
    },
    closeDialog: (state) => {
      state.show = false;
      state.date_range = undefined;
      state.type = null;
    },
    openDialog: (state, action) => {
      state.show = true;
      state.title = action.payload.title;
      state.type = action.payload.type;
      state.filter = action.payload.filter;
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
export const { doneLoading, download, closeDialog, openDialog } =
  exportDataSlice.actions;
export default exportDataSlice.reducer;
