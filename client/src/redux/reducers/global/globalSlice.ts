import { createSlice } from "@reduxjs/toolkit";
import { ToasterI } from "./types/types";
import { getMessage } from "@/utils/util";

interface global_ {
  toasterShow: ToasterI;
  btn: Boolean | undefined | null;
}

const initialState: global_ = {
  toasterShow: {
    message: null,
    show: false,
    variant: null,
    icon: null,
    count: 0,
  },
  btn: false,
};
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    showToaster: (state, action) => {
      try {
        action.payload.show = true;
        const message = action.payload.err
          ? getMessage(action.payload.err)
          : action.payload.message;
        // action.payload.message = message;

        const toChange = {
          ...action.payload,
          message,
          count: state.toasterShow.count + 1,
        };
        state.toasterShow = toChange;
      } catch (err) {
        console.log(err);
      }
    },
    unShowToaster: (state) => {
      state.toasterShow = initialState.toasterShow;
    },
    disableBtn: (state) => {
      state.btn = true;
    },
    enableBtn: (state) => {
      state.btn = false;
    },
  },
});
export const { showToaster, unShowToaster, disableBtn, enableBtn } =
  globalSlice.actions;
export default globalSlice.reducer;
