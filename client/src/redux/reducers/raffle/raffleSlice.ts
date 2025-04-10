//@ts-nocheck
import { raffle } from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
import { getRaffleList } from "./asyncCalls";

interface raffleState {
  rafflesList: raffle[];
  loading: boolean;
}
const initialState: raffleState = {
  rafflesList: [],
  loading: true,
};

const raffleSlice = createSlice({
  name: "raffle",
  initialState,
  reducers: {
    raffleListAdd: (state, action) => {
      state.rafflesList = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(getRaffleList.pending, (state) => {
      state.loading = true;
      state.rafflesList = [];
    });
  },
});
