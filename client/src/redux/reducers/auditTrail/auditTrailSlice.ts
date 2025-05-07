//@ts-nocheck
import { getDataV2 } from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";

interface auditTrailState {
  auditList: [];
  loading: boolean;
  getData: getDataV2;
}

const initialState: auditTrailState = {
  auditList: [],
  loading: true,
  getData: {
    limit: 10,
    offset: 0,
    filter: [],
    sort: [],
    location: null,
  },
};

const auditTrailSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {
    auditListAdd: (state, action) => {
      state.auditList = action.payload;
    },
  },
});

export default auditTrailSlice.reducer;
export const { auditListAdd } = auditTrailSlice.actions;
