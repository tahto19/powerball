import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  fullname: string | null;
  emailAddress: string | null;
  birthdate: Date | null;
  idImage: File | null;
  loading: boolean | undefined;
}

const initialState: userState = {
  fullname: null,
  emailAddress: null,
  birthdate: null,
  idImage: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      try {
        state.loading = true;
        console.log(action);
        state = action.payload;
      } catch (err) {
        state.loading = false;
        console.log(err);
      }
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
