import { getDataV2 } from "@/types/allTypes";
import { createSlice } from "@reduxjs/toolkit";
import { getAlphaCodeList, postAlphaCode } from "./asyncCalls";
import { delay } from "@/utils/util";

interface initialState_ {
  getData: getDataV2;
  name: null | string;
  id: null | string;
  points: number | null;
  mainLoading: boolean;
  count: number | null;
  list: Array<any>;
}

const initialState: initialState_ = {
  getData: {
    limit: 10,
    offset: 0,
    filter: [],
    sort: [],
    location: null,
  },
  list: [],
  name: null,
  id: null,
  points: null,
  mainLoading: false,
  count: 100,
};

const alphaCodeSlice = createSlice({
  name: "alphaCode",
  initialState,
  reducers: {
    alphaCodeListAdd: (state, action) => {
      const { limit, filter, offset, count, rows } = action.payload;
      state.count = count;
      state.getData.limit = limit;
      state.getData.filter = filter;
      state.getData.offset = offset;
      state.list = rows;

      state.getData = action.payload;
    },
    setLoadingAlphaCode: (state, action) => {
      state.mainLoading = action.payload;
    },
  },
  extraReducers: (d) => {
    d.addCase(getAlphaCodeList.pending, (state) => {
      console.log("here");
    });
    d.addCase(postAlphaCode.pending, (state) => {
      state.mainLoading = true;
    });
    d.addCase(postAlphaCode.fulfilled, (state) => {
      state.mainLoading = false;
    });
  },
});

export const { alphaCodeListAdd } = alphaCodeSlice.actions;

export default alphaCodeSlice.reducer;
