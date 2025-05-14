import { _getState } from "./../../../types/allTypes.d";
import { ticketState } from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
import { addTicket, getTicket } from "./asyncCalls";

const initialState: ticketState = {
  ticket: null,
  loading: true,
  getData: {
    list: [],
    loading: false,
    limit: 10,
    offset: 0,
    sort: [],
    filter: [],
    count: 0,
    location: null,
  },
  ticketSubmit: true,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    addTicket_: (state, action) => {
      state.ticket = action.payload;
    },
    addTicketList: (state, action) => {
      state.getData = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(addTicket.pending, (state) => {
      state.loading = true;
      state.ticketSubmit = true;
    });
    b.addCase(addTicket.fulfilled, (state) => {
      state.loading = false;
      state.ticketSubmit = false;
    });
    b.addCase(getTicket.pending, (state) => {
      state.loading = true;
    });
    b.addCase(getTicket.fulfilled, (state) => {
      state.loading = false;
    });
  },
});
export const { addTicket_, addTicketList } = ticketSlice.actions;
export default ticketSlice.reducer;
