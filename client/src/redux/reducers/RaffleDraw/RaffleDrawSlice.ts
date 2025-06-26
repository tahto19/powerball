import { createSlice } from "@reduxjs/toolkit";
import { getData } from "./asyncCalls";

interface getData {
  list: Array<any>;
  row: number;
  limit: number;
  count: number;
  location: number | null | undefined;
  getDataLoading: boolean;
}
interface RaffleDrawI {
  getData: getData;
}
const initialState: RaffleDrawI = {
  getData: {
    list: [],
    row: 0,
    limit: 10,
    count: 0,
    location: null,
    getDataLoading: true,
  },
};

const RaffleDrawSlice = createSlice({
  name: "raffleDraw",
  initialState,
  reducers: {
    addRaffleDrawList: (state, action) => {
      state.getData = { ...state.getData, ...action.payload };
    },
  },
  extraReducers: (d) => {
    d.addCase(getData.pending, (state) => {
      state.getData.getDataLoading = false;
    });
    d.addCase(getData.fulfilled, (state) => {
      state.getData.getDataLoading = true;
    });
  },
});

export const { addRaffleDrawList } = RaffleDrawSlice.actions;
export default RaffleDrawSlice.reducer;
