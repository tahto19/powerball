//@ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { getCostumer } from "./asnycCalls";

interface costumerState {
  list: Array<any> | null;
  loading: boolean | null;
  limit: number | null;
  offset: number | null;
  sort: string | null;
  filter: Array<any> | null;
  count: number | null;
}

const initialState: costumerState = {
  list: [],
  loading: true,
  limit: 10,
  offset: 0,
  sort: '[["id","ASC"]]',
  filter: [],
  count: null,
};

const costumerSlice = createSlice({
  name: "costumer",
  initialState,
  reducers: {
    addListC_: (state, action) => {
      state.list = action.payload.list;
      state.count = action.payload.count;
    },
    addOffsetC_: (state, action) => {
      state.offset = action.payload;
    },
    addLimitC_: (state, action) => {
      state.limit = action.payload;
    },

    addSortC_: (state, action) => {
      state.sort = action.payload;
    },
    addFilterC_: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(getCostumer.fulfilled, (state) => {
      state.loading = false;
    });
    b.addCase(getCostumer.pending, (state) => {
      state.loading = true;
      state.list = [];
    });
  },
});

export const {
  addListC_,
  addOffsetC_,
  addLimitC_,
  addCountC_,
  addSortC_,
  addFilterC_,
} = costumerSlice.actions;
export default costumerSlice.reducer;
