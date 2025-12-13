//@ts-nocheck
import { getDataV2 } from "@/types/allTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { RootState } from "@/redux/store";
import { bodyDecrypt } from "@/utils/util";
import { addRaffleDrawList, addUsersID, updateRedrawLoading } from "./RaffleDrawSlice";

export const getData = createAsyncThunk(
  "raffleDraw/getData",
  async (data: getDataV2 | undefined, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;

      const getFilter = data ? data : state.ticket.getData;
      const _r = await apiService.getWinner(getFilter, token);
      const _rD = bodyDecrypt(_r.data, token);
      console.log(_rD.list)
      _rD.list = _rD.list.map((v: any) => {
        return {
          id: v.id,
          winningTicket: v.ticket_history.ticket_history_generate,
          type: v.Raffle_Prize.Prize_List.type,
          value: v.Raffle_Prize.amount,
          name: v.ticket_detail.User.fullname

        };
      });
      const toReturn = { ...getFilter, ..._rD };

      dispatch(addRaffleDrawList(toReturn));
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);

export const setUsersID = createAsyncThunk(
  "raffleDraw/setUsersID",
  async (data: Array<any>, { dispatch, getState }) => {
    try {
  
      dispatch(addUsersID(data));
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);

export const setRedrawLoading = createAsyncThunk(
  "raffleDraw/setRedrawLoading",
  async (data: boolean, { dispatch, getState }) => {
    try {
  
      dispatch(updateRedrawLoading(data));
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);