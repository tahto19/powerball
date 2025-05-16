//@ts-nocheck
import { userState } from "@/components/addUser/TypesHere";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addOTP, addUser, addUserDetails } from "./userSlice";
import apiService from "@/services/apiService";
import { showToaster } from "../global/globalSlice";
import { bodyDecrypt, bodyEncrypt, delay } from "@/utils/util";
import { veriyCode } from "@/services/types/user";
import { RootState } from "@/redux/store";
import { adminType, getData, postAdminType } from "@/types/allTypes";
import {
  addCount,
  addFilter,
  addLimit,
  addList,
  addOffset,
} from "./adminUsers";
import {
  addFilterC_,
  addLimitC_,
  addListC_,
  addOffsetC_,
  addSortC_,
} from "./costumerUsers";
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
  async (data: getData, { dispatch, getState }) => {
    try {
      var data_ = data;
      const state = getState() as RootState;
      const token = state.token.token;
      if (data === undefined) {
        data_ = state.admin;
      } else {
        dispatch(addOffset(data.offset));
        dispatch(addFilter(data.filter));
        dispatch(addLimit(data.addLimit));
        dispatch(addSort(data.sort));
      }

      let _r = await apiService.getAdmin(data_, token);
      let c = bodyDecrypt(_r.data, token);
      console.log(c);
      if (c.data.result === "error") throw new Error(c.data.message);

      dispatch(addList({ list: c.data.list.rows, count: c.data.list.count }));
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);

export const postAdmin = createAsyncThunk(
  "user/postUser",
  async ({ data, dialogType }: postAdminType, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      console.log(data, dialogType);
      if (dialogType.toLowerCase() === "add")
        await apiService.insertAdmin({...data}, token);
        // await apiService.insertAdmin(bodyEncrypt(data, token));
      else if (dialogType.toLowerCase() === "edit")
        await apiService.updateAdmin({...data}, token);
        // await apiService.updateAdmin(bodyEncrypt(data, token));
      setTimeout(() => {
        dispatch(getAdmin());
      }, [1000]);
      dispatch(
        showToaster({
          message: `successsfully ${dialogType.toLowerCase()}ed admin`,
          variant: "success",
          icon: "success",
        })
      );
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
export const getCostumer = createAsyncThunk(
  "user/getCostumer",
  async (data: getData, { dispatch, getState }) => {
    try {
      var data_ = data;
      const state = getState() as RootState;
      const token = state.token.token;
      if (data === undefined) {
        data_ = state.costumer;
      } else {
        dispatch(addOffsetC_(data.offset));
        dispatch(addFilterC_(data.filter));
        dispatch(addLimitC_(data.addLimit));
        dispatch(addSortC_(data.sort));
      }
      const _r = await apiService.getCostumer(data_, token);
      let c = bodyDecrypt(_r.data, token);
      console.log(c);
      dispatch(addListC_({ list: c.data.list.rows, count: c.data.list.count }));
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (data: getData, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
   
      const _r = await apiService.getUser();
      let c = bodyDecrypt(_r.data, token);
      console.log("11111111111111 ",c);
      dispatch(addUserDetails(c.data));
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
    }
  }
);
