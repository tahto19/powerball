//@ts-nocheck

import { getData, getDataV2, ticketState } from "@/types/allTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { disableBtn, enableBtn, showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { addTicketList } from "./ticketSlice";
import { RootState } from "@/redux/store";
import { bodyDecrypt, delay, getMessage } from "@/utils/util";
import { toast } from "react-toastify";

export const addTicket = createAsyncThunk(
  "ticket/createTicket",
  async (data: string, { dispatch, getState }) => {
    toast.loading("Uploading...", {
      toastId: "scanning_here",
    });

    try {
      dispatch(disableBtn());
      toast.update("scanning_here", {
        render: "Checking Ticket",
        type: "info",
        isLoading: true,
        autoClose: 2000,
      });

      const state = getState() as RootState;
      const token = state.token.token;

      let r = await apiService.postTicketList(data, token);
      let r_data = bodyDecrypt(r.data, token);

      toast.update("scanning_here", {
        // render: r_data.message,
        render: "Congratulations,your ticket has been successfully registered!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // dispatch(getTicket());
      return "success";
    } catch (err) {
      let m = getMessage(err);

      let b = toast.update("scanning_here", {
        render: m,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      console.log(b);
      return "failed";
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
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
      return "failed";
    }
  }
);
