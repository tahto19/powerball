import { raffleEntries } from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
import {
  getRaffleEntry,
  getRaffleEntryList,
  postRaffleEntry,
} from "./asyncCalls";

const initialState: raffleEntries = {
  overallTotalEntries: null,
  totalEntries: null,
  totalTicket: null,
  totalUsedEntries: null,
  loading: true,
  btnLoading: false,
  raffleEntriesList: {
    _loading: true,
    list: [],
    count: 0,
    offset: 0,
    limit: 10,
    filter: [],
    sort: [],
  },
};

const raffleEntriesSlice = createSlice({
  name: "raffleEntry",
  initialState,
  reducers: {
    OverallTotalEntries: (state, action) => {
      state.overallTotalEntries = parseInt(action.payload.totalEntries);
    },
    entriesChange: (state, action) => {
      state.totalEntries = parseInt(action.payload.totalEntries);
      state.totalTicket = parseInt(action.payload.totalTicket);
      state.totalUsedEntries = parseInt(action.payload.totalUsedEntries);
    },
    addEntryList: (state, action) => {
      // Object.assign(state.raffleEntriesList, action.payload);
      state.raffleEntriesList = action.payload;

      // state.raffleEntriesList.list = action.payload.list;
      // state.raffleEntriesList.count = action.payload.count;
      // state.raffleEntriesList.row = action.payload.row;
      // state.raffleEntriesList.limit = action.payload.limit;
      // state.raffleEntriesList.loading = false;
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
      state.raffleEntriesList._loading = true;
    });
    b.addCase(getRaffleEntryList.fulfilled, (state) => {
      state.raffleEntriesList._loading = false;
    });
  },
});

export default raffleEntriesSlice.reducer;
export const { OverallTotalEntries, entriesChange, addEntryList } =
  raffleEntriesSlice.actions;
