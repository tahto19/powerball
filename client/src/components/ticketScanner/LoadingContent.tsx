import FadeContent from "@/animated/FadeContent";
import { CSSProperties, useState } from "react";
import ClockLoader from "react-spinners/ClockLoader";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const LoadingContent = () => {
  let [color, setColor] = useState("#ffffff");
  return (
    <FadeContent
      blur={true}
      duration={1000}
      easing="ease-out"
      initialOpacity={0}
    >
      <ClockLoader
        color={color}
        loading={true}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </FadeContent>
  );
};

export default LoadingContent;
