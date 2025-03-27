import React from "react";
import AnimatedContent from "@/animated/AnimatedContent.tsx";
const SuccessCreation = () => {
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
    ></AnimatedContent>
  );
};

export default SuccessCreation;
