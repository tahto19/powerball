import { createSlice } from "@reduxjs/toolkit";
import { getToken } from "./asyncCalls";
interface tokenFace {
  token: string | null;
  loading: boolean;
  doneLoading: boolean;
}
const initialState: tokenFace = {
  token: null,
  loading: true,
  doneLoading: true,
};
const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    addToken: (state, action) => {
      state.token = action.payload;
    },
    editToken: (state, action) => {
      state.token = action.payload;
    },
    deleteToken: (state) => {
      state.token = null;
    },
    startLoading_: (state) => {
      state.doneLoading = false;
    },
    doneLoading_: (state) => {
      state.doneLoading = true;
    },
  },
  extraReducers: (b) => {
    b.addCase(getToken.fulfilled, (state) => {
      state.loading = false;
      console.log(state.loading, "fulfilled");
    });
    b.addCase(getToken.pending, (state) => {
      state.loading = true;
      console.log(state.loading, "pending");
    });
  },
});

export default tokenSlice.reducer;
export const { addToken, editToken, deleteToken, doneLoading_, startLoading_ } =
  tokenSlice.actions;
