//@ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { getUser, createAccount, outsideAddUser, postAdmin, verfiyAccountUser } from "./asnycCalls";

// interface userState {
//   fullname: string | null;
//   firstname: string | null;
//   lastname: string | null;
//   emailAddress: string | null;
//   birthdate: string | null;
//   loading: boolean | undefined;
//   outside: boolean | undefined;
//   mobileNumber: string | null;
//   file: File[] | null;
//   verifiedAndCreatedAccount: boolean;
//   otpID: number | null;
//   password: string | null;
// }

// const initialState: userState = {
//   fullname: null,
//   firstname: null,
//   lastname: null,
//   emailAddress: null,
//   birthdate: null,
//   loading: false,
//   outside: false,
//   file: null,
//   mobileNumber: null,
//   otpID: null,
//   verifiedAndCreatedAccount: false,
//   password: null,
// };

interface FileState {
  id: number | null;
      name: string;
      description: string;
      file_location: string;
      status: boolean;
      category: string;
      file: File[]
}

interface userState {
  fullname: string | null;
  firstname: string | null;
  lastname: string | null;
  emailAddress: string | null;
  birthdate: string | null;
  loading: boolean | undefined;
  outside: boolean | undefined;
  mobileNumber: string | null;
  file: File[] | null;
  fileInfo: FileState,
  verifiedAndCreatedAccount: boolean;
  otpID: number | null;
  password: string | null;
}

const initialState: userState = {
  fullname: null,
  firstname: null,
  lastname: null,
  emailAddress: null,
  birthdate: null,
  loading: true,
  outside: false,
  file: null,
  fileInfo: {
    id: null,
    name: "",
    description: "",
    file_location: "",
    status: true,
    category: 'user-image',
    file: []
  },
  mobileNumber: null,
  otpID: null,
  verifiedAndCreatedAccount: false,
  password: null,
  isAdmin: false,
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
    },
    addUserDetails: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
      // state.fullname = data.fullname
      // console.log(state.fullname)
      // state = {...state, ...action.payload}
      // console.log(state)
      // console.log(action.payload)

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
    b.addCase(postAdmin.pending, (state)=>{
      state.loading = true
    });
    b.addCase(postAdmin.fulfilled, (state)=>{
      state.loading = false
    })
    b.addCase(getUser.pending, (state)=>{
      state.loading = true
    });
    b.addCase(getUser.fulfilled, (state)=>{
      state.loading = false
    })
  },
});

export const {addUserDetails, returnToVerification, addUser, returnToAddUser, addOTP, editDetails } =
  userSlice.actions;
export default userSlice.reducer;
