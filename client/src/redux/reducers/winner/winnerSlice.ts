import {
  totalWinnerInterface,
  winnerInitialState,
  winnerListInterface,
} from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
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
});
export const { addWinnerList } = winnerSlice.actions;

export default winnerSlice.reducer;
