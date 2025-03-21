import { useAppDispatch } from "@/redux/hook";
import { returnToAddUser } from "@/redux/reducers/user/userSlice";
import { Button } from "@mui/material";
import AnimatedContent from "@/animated/AnimatedContent.tsx";
import React from "react";

const VerificationCode = () => {
  const dispatch = useAppDispatch();
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
      asdasd
      <Button
        onClick={() => {
          dispatch(returnToAddUser());
        }}
      >
        balik
      </Button>
    </AnimatedContent>
  );
};

export default VerificationCode;
