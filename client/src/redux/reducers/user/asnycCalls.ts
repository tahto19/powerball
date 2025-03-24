import { userState } from "@/components/AddUser/Types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addUser } from "./userSlice";
import apiService from "@/services/apiService";
import { showToaster } from "../global/globalSlice";
import { getMessage } from "@/utils/util";
export const outsideAddUser = createAsyncThunk(
  "user/outsideAddUser",
  async (data: userState, { dispatch }) => {
    try {
      // return data;
      dispatch(addUser(data));
      const _r = await apiService.createUser(data);
      console.log(_r);
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
      getMessage(err);
    }
  }
);
