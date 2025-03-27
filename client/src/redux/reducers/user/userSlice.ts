import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAccount, outsideAddUser, verfiyAccountUser } from "./asnycCalls";
import { useAppDispatch } from "@/redux/hook";

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
  },
  extraReducers: (b) => {
    b.addCase(outsideAddUser.fulfilled, (state, action) => {
      state.loading = false;
    });
    b.addCase(outsideAddUser.pending, (state) => {
      state.loading = true;
    });
    b.addCase(verfiyAccountUser.fulfilled, () => {
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

export const { addUser, returnToAddUser, addOTP, editDetails } =
  userSlice.actions;
export default userSlice.reducer;
