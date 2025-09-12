//@ts-nocheck
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { RootState } from "@/redux/store";
import { getDataV2 } from "@/types/allTypes";
import { addWinnerList } from "./winnerSlice";
import { bodyDecrypt } from "@/utils/util";
import _ from "lodash";

export const getWinnerListAsync = createAsyncThunk(
  "winner/getWinnerList",
  async (data: getDataV2, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      const url = data.location;
      const getFilter = data ? data : state.winner.winnerList;
      if (token) {
        const _r = await apiService.getWinnerList(getFilter, token, url);
        const _rData = _.cloneDeep(bodyDecrypt(_r.data, token));

        _rData["list"] = _rData.list.map((v) => {
          if (url === "getDataAll")
            return {
              id: v.id,
              "$ticket_detail.User.fullname$": v.ticket_detail.User.fullname,
              "$ticket_detail.User.mobileNumber$":
                v.ticket_detail.User.mobileNumber,
              "$ticket_detail.User.emailAddress$":
                v.ticket_detail.User.emailAddress,
              "$ticket_history.ticket_history_generate$":
                v.ticket_history.ticket_history_generate,
              "$ticket_detail.ticket_code$": v.ticket_detail.ticket_code,
              "$ticket_detail.VIN$": v.ticket_detail.VIN,
              "$Raffle_Prize.amount$": v.Raffle_Prize.amount,
              createdAt: v.createdAt,
            };
          else
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
              Status: v.file?.id ? "Claimed" : "Unclaimed",
            };
          // return v;
        });
        const toReturn = { ..._rData, ...getFilter, loading: false };
        console.log(toReturn);
        dispatch(addWinnerList(toReturn));
      }
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
