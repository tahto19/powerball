import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { RootState } from "@/redux/store";
import { getDataV2 } from "@/types/allTypes";
import { addWinnerList } from "./winnerSlice";

export const getWinnerList = createAsyncThunk(
  "winner/getWinnerList",
  async (data: getDataV2, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      const getFilter = data ? data : state.ticket.getData;

      //   const _r = await apiService.getWinnerList(getFilter, token);
      //   const toReturn {..._r.data, ...getFilter,...loading:false}
      dispatch(addWinnerList(_r.data));
    } catch (err) {
      console.log(err);
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
