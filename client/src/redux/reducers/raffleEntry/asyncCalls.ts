//@ts-nocheck

import { bodyDecrypt } from "@/utils/util";
import { getDataV2 } from "@/types/allTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { RootState } from "@/redux/store";
import { entriesChange } from "./raffleEntrySlice";
import { enterEntries } from "@/components/2ndChance_iFrame/Raffles/interface";

export const getRaffleEntry = createAsyncThunk(
  "raffleEntry/getRaffle",
  async (_, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      let _r = await apiService.getRaffleEntry();

      let bd = bodyDecrypt(_r.data, token);

      if (bd.result === "error") throw new Error(bd.message);
      dispatch(entriesChange(bd.data[0]));
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
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
