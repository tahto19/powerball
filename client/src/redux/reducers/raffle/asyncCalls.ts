import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToaster } from "../global/globalSlice";

export const getRaffleList = createAsyncThunk(
  "raffle/getRaffle",
  async (_, { dispatch }) => {
    try {
      // let r_ = await
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "erro" }));
    }
  }
);
