import React, { useState } from "react";

import { Box } from "@mui/material";

// import AddUser from "@components/";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hook";
import VerificationCode from "./VerificationCode";
import AddUserC from "./AddUserC.tsx";

const AdduserMain = () => {
  const { outside, verifiedAndCreatedAccount } = useAppSelector(
    (state: RootState) => state.user
  );
  return (
    <Box>
      {!outside ? (
        <AddUserC />
      ) : !verifiedAndCreatedAccount ? (
        <VerificationCode />
      ) : (
        "test"
      )}
    </Box>
  );
};

export default AdduserMain;
