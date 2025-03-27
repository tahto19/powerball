import { userState } from "@/components/AddUser/Types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addOTP, addUser } from "./userSlice";
import apiService from "@/services/apiService";
import { showToaster } from "../global/globalSlice";
import { delay, getMessage } from "@/utils/util";
import { veriyCode } from "@/services/types/user";
import { RootState } from "@/redux/store";
export const outsideAddUser = createAsyncThunk(
  "user/outsideAddUser",
  async (data: userState, { dispatch }) => {
    try {
      // return data;

      const _r = await apiService.createOTP(data);
      console.log(data);
      dispatch(addUser(data));
      dispatch(addOTP(_r.data.data));
      return true;
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
      return false;
    }
  }
);
export const verfiyAccountUser = createAsyncThunk(
  "user/verifyAccount",
  async (data: veriyCode, { dispatch }) => {
    try {
      await apiService.verifyOTP(data);
      dispatch(
        showToaster({
          message: "successfully verified",
          variant: "success",
          icon: "success",
        })
      );
      await delay(150);
      dispatch(
        showToaster({
          message: "Please Wait Still creating an account",
          variant: "info",
          icon: "info",
        })
      );
      dispatch(createAccount(data));
      return true;
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
      return false;
    }
  }
);
export const createAccount = createAsyncThunk(
  "user/createAccount",
  async (data: veriyCode, { dispatch, getState }) => {
    try {
      // return data;
      const state = getState() as RootState;
      const {
        emailAddress,
        file,
        firstname,
        lastname,
        mobileNumber,
        birthdate,
        password,
      } = state.user;
      console.log(file, firstname, lastname, mobileNumber, birthdate);
      const _r = await apiService.createUser({
        file,
        firstname,
        lastname,
        mobileNumber,
        birthdate,
        emailAddress,
        password,
      });
      dispatch(
        showToaster({
          message: "Done Creating User",
          variant: "info",
          icon: "info",
        })
      );
      return true;
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
      return false;
    }
  }
);
