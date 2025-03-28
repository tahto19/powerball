//@ts-nocheck

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface navState {
  open: boolean
}

const initialState: navState = {
  open: true,
};

const navBarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    openNav: (state, action) => {
      state.open = action.payload
    },
  },
});

export const { openNav } = navBarSlice.actions;
export default navBarSlice.reducer;
