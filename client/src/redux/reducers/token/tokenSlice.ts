import { createSlice } from "@reduxjs/toolkit";
import { getToken } from "./asyncCalls";
interface tokenFace {
  token: string | null;
  loading: boolean;
  doneLoading:boolean;
}
const initialState: tokenFace = {
  token: null,
  loading: true,
  doneLoading:false
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
  },
  extraReducers: (b) => {
    b.addCase(getToken.fulfilled, (state) => {
      state.loading = false;
      state.doneLoading = true
    });
    b.addCase(getToken.pending, (state) => {
      state.loading = true;
      
    });
  },
});

export default tokenSlice.reducer;
export const { addToken, editToken, deleteToken } = tokenSlice.actions;
