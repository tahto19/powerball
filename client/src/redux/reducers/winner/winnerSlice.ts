//@ts-nocheck
import {
  totalWinnerInterface,
  winnerInitialState,
  winnerListInterface,
} from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
import { getWinnerListAsync } from "./asyncSlice";
const total: totalWinnerInterface = {
  t_loading: false,
  total_winner: null,
  total_entries: null,
};
const winnerList: winnerListInterface = {
  _loading: false,
  offset: 0,
  limit: 10,
  sort: [],
  filter: [],
  list: [],
  count: 0,
  location: null,
};
const initialState: winnerInitialState = {
  total,
  winnerList,
};
const winnerSlice = createSlice({
  name: "winner",
  initialState,
  reducers: {
    addWinnerList: (state, action) => {
      state.winnerList = action.payload;
    },
  },
  extraReducers: (d) => {
    d.addCase(getWinnerListAsync.pending, (state) => {
      state.winnerList._loading = true;
    });
    d.addCase(getWinnerListAsync.fulfilled, (state) => {
      state.winnerList._loading = false;
    });
  },
});
export const { addWinnerList } = winnerSlice.actions;

export default winnerSlice.reducer;
