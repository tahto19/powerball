//@ts-nocheck
import { userState } from "@/components/addUser/TypesHere";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addOTP, addUser } from "./userSlice";
import apiService from "@/services/apiService";
import { showToaster } from "../global/globalSlice";
import { delay } from "@/utils/util";
import { veriyCode } from "@/services/types/user";
import { RootState } from "@/redux/store";
import { adminType, getData } from "@/types/allTypes";
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
      await apiService.createUser({
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
export const getAdmin = createAsyncThunk(
  "user/getAdmin",
  async (data:getData, { dispatch ,getState}) => {
    try {
      var data_ = data
      if(data === undefined){
        const state = getState() as RootState;
        data_ = state.admin
   
      }
   
      let _r = await apiService.getAdmin(data_)
    
    } catch (err) {
      console.log("here");
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);

export const postAdmin = createAsyncThunk(
  "user/postUser",
  async(data:adminType,{dispatch})=>{
    try{
      let _r = await apiService.insertAdmin(data)
      dispatch(showToaster({ message:'successsfully added admin', variant: "success", icon: "success" }));
    }catch(err){
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
)
