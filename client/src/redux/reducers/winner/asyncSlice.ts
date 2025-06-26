//@ts-nocheck
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { RootState } from "@/redux/store";
import { getDataV2 } from "@/types/allTypes";
import { addWinnerList } from "./winnerSlice";
import { bodyDecrypt } from "@/utils/util";

export const getWinnerListAsync = createAsyncThunk(
  "winner/getWinnerList",
  async (data: getDataV2, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      const url = data.location;
      const getFilter = data ? data : state.winner.winnerList;

      const _r = await apiService.getWinnerList(getFilter, token, url);
      const _rData = bodyDecrypt(_r.data, token);
      console.log(_rData);
      _rData["list"] = _rData.list.map((v) => {
        return {
          Name:
            v.ticket_detail.User.fullname.substring(0, 1) +
            " __ " +
            v.ticket_detail.User.fullname.substring(3, 4),
          id: v.id,
          "$ticket_history.ticket_history_generate$":
            v.ticket_history.ticket_history_generate,
          "$Raffle_Prize.Raffle_Schedule.raffleDetails.name$":
            v.Raffle_Prize.Raffle_Schedule.raffleDetails.name,
          Status: "unclaimed",
        };
      });
      const toReturn = { ..._rData, ...getFilter, loading: false };

      dispatch(addWinnerList(toReturn));
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
