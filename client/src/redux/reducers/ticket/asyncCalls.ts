import { getData, getDataV2, ticketState } from "@/types/allTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { disableBtn, enableBtn, showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { addTicketList } from "./ticketSlice";
import { RootState } from "@/redux/store";
import { bodyDecrypt } from "@/utils/util";

export const addTicket = createAsyncThunk(
  "ticket/createTicket",
  async (data: ticketState, { dispatch, getState }) => {
    try {
      dispatch(disableBtn());
      const state = getState() as RootState;
      const token = state.token.token;
      let r = await apiService.postTicketList(data, token);
      dispatch(
        showToaster({
          message: "Successfully added",
          variant: "success",
          icon: "success",
        })
      );
      dispatch(getTicket());
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
export const getTicket = createAsyncThunk(
  "ticket/getTicket",
  async (data: getDataV2 | undefined, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      const getFilter = data ? data : state.ticket.getData;
      let r = await apiService.getTicketList(getFilter, token);
      let r_data = bodyDecrypt(r.data, token);

      let toReturn = { ...r_data, ...data, loading: false };

      dispatch(addTicketList(toReturn));
    } catch (err) {
      console.log(err);
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
