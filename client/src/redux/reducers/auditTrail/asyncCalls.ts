//@ts-nocheck
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import { getDataV2 } from "@/types/allTypes";
import { RootState } from "@/redux/store";
import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";

export const getAuditTrail = createAsyncThunk(
  "audit/getAudit",
  async (data: getDataV2, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.token.token;
    const getFilter = data ? data : state.ticket.getData;
    let r = await apiService.getAudit(getFilter, token);
    let r_data = bodyDecrypt(r.data, token);
    try {
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
