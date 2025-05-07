// import Squares from "./Animation/Squers.tsx";
//@ts-nocheck
import FuzzyText from "@/animated/FuzzyText";
import Particles from "@/animated/Particles";

const ErrorPage = () => {
  return (
    <div
      style={{
        alignContent: "center",
        textAlign: "center",
        height: "100%",
        width: "100%",
        background: "#000000",
      }}
    >
      <Particles
        particleColors={["#ffffff", "#ffffff"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      >
        {/* <Squares
        speed={0.5}
        squareSize={40}
        direction="diagonal" // up, down, left, right, diagonal
        borderColor="#fff"
        hoverFillColor="#222"
      /> */}
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={1}
          enableHover={true}
        >
          Oops!
        </FuzzyText>
        <br />
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={1}
          enableHover={true}
        >
          404
        </FuzzyText>
      </Particles>
    </div>
  );
};

export default ErrorPage;
