import { userState } from "@/components/AddUser/Types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addUser } from "./userSlice";
export const outsideAddUser = createAsyncThunk(
  "user/outsideAddUser",
  async (data: userState, { dispatch }) => {
    // return data;
    dispatch(addUser(data));
  }
);
