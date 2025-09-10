import { freeTickets_, getDataV2 } from "@/types/allTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import { RootState } from "@/redux/store";
import apiService from "@/services/apiService";
import { addGetDataFreeT } from "./freeTicketsSlice";

export const getDataFreeTicket_ = createAsyncThunk(
  "freeTicket/getData",
  async (data: getDataV2 | undefined, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      const getFilter = data ? data : state.freeTickets.getData;
      const _r = await apiService.getFreeTickets(getFilter, token);
      console.log(_r);
      const toReturn = { getData: getFilter, ..._r };

      dispatch(addGetDataFreeT(toReturn));
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
export const postDataFreeTicket_ = createAsyncThunk(
  "freeTicket/getData",
  async (data: freeTickets_, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      const id = data.id
        ? apiService.patchFreeTickets(data, token)
        : apiService.postFreeTickets(data, token);
      await id;
      dispatch(getDataFreeTicket_());
      dispatch(
        showToaster({
          message: "successful",
          variant: "success",
          icon: "success",
        })
      );
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
