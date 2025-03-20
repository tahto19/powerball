import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step, { StepContext } from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Box, Button, StepContent } from "@mui/material";
import AddUser from "./AddUser";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hook";
const steps = ["Create Account", "Verify account", "Created"];
const AdduserMain = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { outside } = useAppSelector((state: RootState) => state.user);
  return <Box>{outside && outside.toString()}</Box>;
};

export default AdduserMain;
