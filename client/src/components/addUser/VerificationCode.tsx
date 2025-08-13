import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Button, Grid2, styled, Typography } from "@mui/material";
import AnimatedContent from "@/animated/AnimatedContent.tsx";
import { useEffect, useState } from "react";

import { verfiyAccountUser } from "@/redux/reducers/user/asnycCalls";
import { RootState } from "@/redux/store";

const MuiOtpInputStyled = styled(MuiOtpInput)`
  display: flex;

  margin-inline: auto;
`;
const VerificationCode = () => {
  const dispatch = useAppDispatch();
  const [otp, setOTP] = useState("");
  const { otpID, loading } = useAppSelector((state: RootState) => state.user);
  console.log(loading);
  useEffect(() => {
    console.log(loading, otpID);
  }, [loading]);
  return (
    <AnimatedContent
      distance={200}
      direction="horizontal"
      reverse={false}
      config={{ tension: 80, friction: 20 }}
      initialOpacity={0.8}
      animateOpacity
      scale={1.1}
      threshold={0.2}
    >
      <Grid2
        container
        spacing={2}
        direction="column"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Grid2 size={{ md: 12, sm: 12 }}>
          <Typography sx={{ fontWeight: "bolder", fontSize: "2.2em" }}>
            Please check your mobile for the verification code.
          </Typography>
        </Grid2>
        <Grid2 size={{ md: 12, sm: 12 }}>
          <Typography>
            We’ve sent a one-time password (OTP) to your mobile number. Please
            enter it below.
          </Typography>
        </Grid2>
        <Grid2 size={{ md: 5, sm: 8 }}>
          <MuiOtpInputStyled
            className="MuiOtpInput-TextField"
            TextFieldsProps={{ placeholder: "-" }}
            value={otp}
            autoFocus
            onChange={(e) => setOTP(e)}
            length={6}
          />
        </Grid2>
        <Grid2 size={{ md: 4, sm: 12 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              dispatch(verfiyAccountUser({ code: otp, id: otpID }));
            }}
            loading={loading}
            sx={{
              background: "#000000",
              border: "none",
              fontWeight: "bolder",
              fontSize: "16px",
            }}
          >
            Verify
          </Button>
        </Grid2>
      </Grid2>
    </AnimatedContent>
  );
};

export default VerificationCode;
