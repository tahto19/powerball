import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step, { StepContext } from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Box, Button, StepContent } from "@mui/material";
import AddUser from "./AddUser";
const steps = ["Create Account", "Verify account", "Created"];
const AdduserMain = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>Create Account</StepLabel>
          <StepContent>
            <AddUser />
          </StepContent>
        </Step>
        <Step>{/* <StepLabel {...labelProps}>{label}</StepLabel> */}sss</Step>
        <Step>{/* <StepLabel {...labelProps}>{label}</StepLabel> */}sss</Step>
      </Stepper>
    </Box>
  );
};

export default AdduserMain;
