import { createSlice } from "@reduxjs/toolkit";
import { createAccount, outsideAddUser, verfiyAccountUser } from "./asnycCalls";

interface userState {
  firstname: string | null;
  lastname: string | null;
  emailAddress: string | null;
  birthdate: string | null;
  loading: boolean | undefined;
  outside: boolean | undefined;
  mobileNumber: string | null;
  file: File[] | null;
  verifiedAndCreatedAccount: boolean;
  otpID: number | null;
  password: string | null;
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
  verifiedAndCreatedAccount: false,
  password: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      try {
        state.loading = true;
        Object.assign(state, action.payload);
        console.log(action.payload);
        state.outside = true;
      } catch (err) {
        console.log(err);
      }
    },
    returnToAddUser: (state) => {
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
    returnToVerification:(state)=>{
      state.verifiedAndCreatedAccount = false
    }
  },
  extraReducers: (b) => {
    b.addCase(outsideAddUser.fulfilled, (state) => {
      state.loading = false;
    });
    b.addCase(outsideAddUser.pending, (state) => {
      state.loading = true;
    });
    b.addCase(verfiyAccountUser.fulfilled, (state) => {
      state.loading = false;
    });
    b.addCase(verfiyAccountUser.pending, (state) => {
      state.loading = true;
    });
    b.addCase(createAccount.fulfilled, (state) => {
      state.loading = false;
      state.verifiedAndCreatedAccount = true;
    });
  },
});

export const {returnToVerification, addUser, returnToAddUser, addOTP, editDetails } =
  userSlice.actions;
export default userSlice.reducer;
