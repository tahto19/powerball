import { createSlice } from "@reduxjs/toolkit";
import { getToken, userLogout } from "./asyncCalls";
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
    });
    b.addCase(getToken.pending, (state) => {
      state.loading = true;
    });
     b.addCase(userLogout.fulfilled, (state) => {
      state.loading = false;
    });
    b.addCase(userLogout.pending, (state) => {
      state.loading = true;
    });
  },
});

export default tokenSlice.reducer;
export const { addToken, editToken, deleteToken, doneLoading_, startLoading_ } =
  tokenSlice.actions;
