
import { Box } from "@mui/material";

// import AddUser from "@components/";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hook";
import VerificationCode from "./VerificationCode";
import AddUserC from "./AddUserC.tsx";
import SuccessCreation from "./SuccessCreation.tsx";

const AdduserMain = () => {
  const { outside, verifiedAndCreatedAccount } = useAppSelector(
    (state: RootState) => state.user
  );

  console.log(outside)
  return (
    <Box>
      {!outside ? (
        <AddUserC />
      ) : !verifiedAndCreatedAccount ? (
        <VerificationCode />
      ) : (
        <SuccessCreation />
      )}
    </Box>
  );
};

export default AdduserMain;
