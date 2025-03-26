import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { outsideAddUser } from "./asnycCalls";

interface userState {
  firstname: string | null;
  lastname: string | null;
  emailAddress: string | null;
  birthdate: string | null;
  loading: boolean | undefined;
  outside: boolean | undefined;
  mobileNumber: string | null;
  file: File[] | null;
  otpID: number | null;
}

const initialState: userState = {
  firstname: null,
  lastname: null,
  emailAddress: null,
  birthdate: null,
  loading: false,
  outside: false,
  file: null,
  mobileNumber: null,
  otpID: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      try {
        state.loading = true;
        Object.assign(state, action.payload);
        state.outside = true;
      } catch (err) {
        state.loading = false;
        console.log(err);
      }
    },
    returnToAddUser: (state) => {
      console.log(state, "beofre");
      state.outside = false;
    },
    addOTP: (state, action) => {
      state.otpID = action.payload;
    },
    editDetails: (state, action) => {
      console.log(action.payload);
      Object.assign(state, action.payload);
      state.outside = true;
    },
  },
  extraReducers: (b) => {
    b.addCase(outsideAddUser.fulfilled, (state) => {
      state.outside = true;
    });
    b.addCase(outsideAddUser.pending, (state, action) => {
      console.log(action, state);
    });
  },
});

export const { addUser, returnToAddUser, addOTP, editDetails } =
  userSlice.actions;
export default userSlice.reducer;
