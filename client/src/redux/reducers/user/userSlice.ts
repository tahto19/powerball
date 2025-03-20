import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { outsideAddUser } from "./asnycCalls";

interface userState {
  firstname: string | null;
  lastname: string | null;
  emailAddress: string | null;
  birthdate: Date | null;
  loading: boolean | undefined;
  outside: boolean | undefined;
  file: File[] | null;
}

const initialState: userState = {
  firstname: null,
  lastname: null,
  emailAddress: null,
  birthdate: null,
  loading: false,
  outside: false,
  file: null,
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
  extraReducers: (b) => {
    b.addCase(outsideAddUser.fulfilled, (state) => {
      state.outside = true;
    });
    b.addCase(outsideAddUser.pending, (state, action) => {
      console.log(action, state);
    });
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
