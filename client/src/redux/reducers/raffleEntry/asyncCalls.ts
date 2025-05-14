//@ts-nocheck

import { bodyDecrypt } from "@/utils/util";
import { getDataV2 } from "@/types/allTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { RootState } from "@/redux/store";
import { addEntryList, entriesChange } from "./raffleEntrySlice";
import { enterEntries } from "@/components/2ndChance_iFrame/Raffles/interface";

export const getRaffleEntry = createAsyncThunk(
  "raffleEntry/getRaffle",
  async (type: string | undefined, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      let _r = await apiService.getRaffleEntry(type);

      let bd = bodyDecrypt(_r.data, token);

      if (bd.result === "error") throw new Error(bd.message);
      dispatch(entriesChange(bd.data[0]));
    } catch (err) {
      // dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);

export const postRaffleEntry = createAsyncThunk(
  "raffleEntry/postRaffle",
  async (data: enterEntries, { dispatch, getState }) => {
    try {
      let state = getState() as RootState;
      let token = state.token.token;
      let _r = await apiService.postRaffleEntry(data, token);
      let bd = bodyDecrypt(_r.data, token);
      dispatch(
        showToaster({
          message: "successfully added entries",
          variant: "success",
          icon: "success",
        })
      );
      dispatch(getRaffleEntry());
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
export const getRaffleEntryList = createAsyncThunk(
  "raffleEntry/getRaffleEntryList",
  async (data: getDataV2, { dispatch, getState }) => {
    try {
      console.log(data);
      const state = getState() as RootState;
      const token = state.token.token;

      const url = data.location;
      const getFilter = data ? data : state.ticket.getData;
      let _r = await apiService.getRaffleEntryList(getFilter, token, url);
      let r_data = bodyDecrypt(_r.data, token);
      console.log(r_data);
      r_data.list = r_data.list.map((v) => {
        return {
          id: v.id,
          createdAt: v.createdAt,
          ticket_history_generate: v.ticket_history_generate,
          "$Raffle_Schedule.status_text$":
            v.wining_draw_detail !== null
              ? "Winner"
              : v.Raffle_Schedule.status_text,
          "$Raffle_Schedule.raffleDetails.name$":
            v.Raffle_Schedule.raffleDetails.name,
          "$Raffle_Schedule.schedule_date$": v.Raffle_Schedule.schedule_date,
          date_time: v.Raffle_Schedule.schedule_date,
        };
      });

      let toReturn = { ...r_data, ...getFilter, loading: false };

      dispatch(addEntryList(toReturn));
      return toReturn;
      // dispatch(addTicketList(toReturn));
    } catch (err) {
      console.log(err);
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
