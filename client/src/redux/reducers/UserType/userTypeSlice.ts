import { createSlice } from "@reduxjs/toolkit";
import { getUserTypeByUserID } from "./asyncCalls";
interface userTypeInterface {
  permissions: Array<any> | null;
  myPermission: Array<any> | null;
  loadingUserType: boolean | null;
  id: number | null;
  myId: number | null;
}
const initialState: userTypeInterface = {
  permissions: null,
  myPermission: null,
  loadingUserType: true,
  id: null,
  myId: null,
};
const userTypeSlice = createSlice({
  name: "usertype",
  initialState,
  reducers: {
    addPermissions: (state, action) => {
      state.permissions = action.payload.permissions;
      state.id = action.payload.id;
    },
    addMyPermissions: (state, action) => {
      state.myPermission = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(getUserTypeByUserID.pending, (state) => {
      state.loadingUserType = true;
    });
    b.addCase(getUserTypeByUserID.fulfilled, (state) => {
      state.loadingUserType = false;
    });
  },
});

export const { addPermissions, addMyPermissions } = userTypeSlice.actions;
export default userTypeSlice.reducer;
