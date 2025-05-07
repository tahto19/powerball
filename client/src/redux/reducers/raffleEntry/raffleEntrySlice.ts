import { raffleEntries } from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
import {
  getRaffleEntry,
  getRaffleEntryList,
  postRaffleEntry,
} from "./asyncCalls";

const initialState: raffleEntries = {
  totalEntries: null,
  totalTicket: null,
  totalUsedEntries: null,
  loading: true,
  btnLoading: false,
  raffleEntriesList: {
    loading: true,
    list: [],
    count: 0,
    row: 0,
    limit: 0,
  },
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
    addEntryList: (state, action) => {
      console.log(action.payload);
      state.raffleEntriesList = action.payload;
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
    b.addCase(getRaffleEntryList.pending, (state) => {
      state.raffleEntriesList.loading = true;
    });
    b.addCase(getRaffleEntryList.fulfilled, (state) => {
      state.raffleEntriesList.loading = false;
    });
  },
});

export default raffleEntriesSlice.reducer;
export const { entriesChange, addEntryList } = raffleEntriesSlice.actions;
