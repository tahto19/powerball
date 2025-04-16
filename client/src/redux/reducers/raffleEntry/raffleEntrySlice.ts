import { raffleEntries } from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
import { getRaffleEntry, postRaffleEntry } from "./asyncCalls";

const initialState: raffleEntries = {
  totalEntries: null,
  totalTicket: null,
  totalUsedEntries: null,
  loading: true,
  btnLoading: false,
};

const raffleEntriesSlice = createSlice({
  name: "raffleEntry",
  initialState,
  reducers: {
    entriesChange: (state, action) => {
      state.totalEntries = parseInt(action.payload.totalEntries);
      state.totalTicket = parseInt(action.payload.totalTicket);
      state.totalUsedEntries = parseInt(action.payload.totalUsedEntries);
    },
  },
  extraReducers: (b) => {
    b.addCase(getRaffleEntry.pending, (state) => {
      state.loading = true;
    });
    b.addCase(getRaffleEntry.fulfilled, (state) => {
      state.loading = false;
    });
    b.addCase(postRaffleEntry.fulfilled, (state) => {
      state.btnLoading = false;
    });
    b.addCase(postRaffleEntry.pending, (state) => {
      state.btnLoading = true;
    });
  },
});

export default raffleEntriesSlice.reducer;
export const { entriesChange } = raffleEntriesSlice.actions;
