import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";
import apiService from "@/services/apiService";
import { RootState } from "@/redux/store";
import { addPermissions } from "./userTypeSlice";
import { updateDataUserType } from "@/types/allTypes";
import { toast } from "react-toastify";
import { getMessage } from "@/utils/util";

export const getUserTypeByUserID = createAsyncThunk(
  "usertype/getUserType",
  async (id: number, { dispatch, getState }) => {
    try {
      console.log(id);
      const state = getState() as RootState;
      const token = state.token.token;

      let r_ = await apiService.getUserTypeByUserId(id, token);
      dispatch(addPermissions(r_.myUserType));
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
      return false;
    }
  }
);

export const updateUserType = createAsyncThunk(
  "usertype/updateUserType",
  async (data: updateDataUserType, { dispatch: _dispatch, getState }) => {
    const toastId = toast.loading("Updating User type");
    try {
      console.log(data);
      const state = getState() as RootState;
      const token = state.token.token;

      await apiService.patchUserType(data, token);

      toast.update(toastId, {
        render: "Update successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      //   dispatch(addPermissions(r_.myUserType.permissions));
    } catch (err) {
      let message = getMessage(err);
      toast.update(toastId, {
        type: "error",
        render: message,
        autoClose: 5000,
        isLoading: false,
        hideProgressBar: false,
      });
      return false;
    }
  }
);
export const getMyUserType = createAsyncThunk(
  "usertype/getMyUserType",
  async (data, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.token.token;
      let r = await apiService.getMyUserType(data, token);
      console.log(r);
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
      return false;
    }
  }
);
