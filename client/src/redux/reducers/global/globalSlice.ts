import { createSlice } from "@reduxjs/toolkit";
import { ToasterI } from "./types/types";
import { getMessage } from "@/utils/util";

interface global_ {
  toasterShow: ToasterI;
}

const initialState: global_ = {
  toasterShow: {
    message: null,
    show: false,
    variant: null,
    icon: null,
  },
};
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    showToaster: (state, action) => {
      action.payload.show = true;
      const message = getMessage(
        action.payload.err ? action.payload.err : action.payload.message
      );
      action.payload.message = message;
      state.toasterShow = action.payload;
    },
    unShowToaster: (state) => {
      state.toasterShow = initialState.toasterShow;
    },
  },
});
export const { showToaster, unShowToaster } = globalSlice.actions;
export default globalSlice.reducer;
