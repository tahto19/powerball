//@ts-nocheck
import AnimatedContent from "@/animated/AnimatedContent.tsx";
import { Button, Grid2, Typography } from "@mui/material";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";
import { returnToVerification } from "@/redux/reducers/user/userSlice";
import { useAppDispatch } from "@/redux/hook";

const SuccessCreation = () => {
  const { width, height } = useWindowSize();
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <AnimatedContent
      distance={25}
      direction="vertical"
      reverse={true}
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
        <Confetti
          width={width ? width : 100}
          height={height ? height : 100}
        />
        <Grid2 size={{ md: 12, sm: 12 }}>
          <Typography sx={{ fontWeight: "bolder", fontSize: "2.2em" }}>
            Congratulations! You have successfully created an account!
          </Typography>
        </Grid2>
        <Grid2 size={{ md: 6, sm: 12 }}>
          <Button
            variant="contained"
            sx={{
              background: "#000000",
              border: "none",
              fontWeight: "bolder",
              fontSize: "16px",
            }}
            fullWidth
            onClick={() => {
              nav("/iframe/2nd-chance/login");
            }}
          >
            Login Now
          </Button>
          {/* <Button
            onClick={() => {
              dispatch(returnToVerification());
            }}
          >
            return
          </Button> */}
        </Grid2>
      </Grid2>
    </AnimatedContent>
  );
};

export default SuccessCreation;
