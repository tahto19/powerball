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
      const toReturn = { ..._rData, ...getFilter, loading: false };
      console.log(toReturn);
      //   dispatch(addWinnerList(toReturn));
    } catch (err) {
      console.log(err);
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
