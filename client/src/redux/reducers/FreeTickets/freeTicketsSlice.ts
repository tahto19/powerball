import { getDataV2 } from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
import { getDataFreeTicket_ } from "./asyncCalls";
type i_face = {
  loading: boolean;
  getData: getDataV2;
  list: Array<any>;
  count: null | number;
};
const initialState: i_face = {
  loading: false,
  list: [],
  count: 0,
  getData: {
    sort: [],
    filter: [],
    offset: 0,
    limit: 10,
  },
};

const freeTicketsSlice = createSlice({
  name: "freeTicket",
  initialState,
  reducers: {
    doneLoading: (state) => {
      state.loading = false;
    },
    showLoading: (state) => {
      state.loading = true;
    },
    addGetDataFreeT: (state, action) => {
      const payload = action.payload;

      if (payload.getData) state.getData = payload.getData;
      if (payload.list) state.list = payload.list;
      if (payload.count !== undefined) state.count = payload.count;
    },
  },
  extraReducers: (d) => {
    d.addCase(getDataFreeTicket_.pending, (state) => {
      state.loading = true;
    });
    d.addCase(getDataFreeTicket_.fulfilled, (state) => {
      state.loading = false;
    });
  },
});

export const { addGetDataFreeT } = freeTicketsSlice.actions;

export default freeTicketsSlice.reducer;
