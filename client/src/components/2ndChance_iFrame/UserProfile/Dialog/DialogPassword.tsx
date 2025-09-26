import { useAppDispatch } from "@/redux/hook";
import {
  applyForOTP,
  verifyOTPForChangePassword,
} from "@/redux/reducers/user/asnycCalls";
import { userPassword } from "@/types/allTypes";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid2,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import Countdown from "react-countdown";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
// import { useState } from "react";

const MuiOtpInputStyled = styled(MuiOtpInput)`
  display: flex;
  margin-inline: auto;
`;
export default function DialogPassword({
  open,
  closeDialog,
}: {
  open: boolean;
  closeDialog: () => void;
}) {
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<userPassword>({
    mode: "onChange", // Validates on input change
  });
  const dispatch = useAppDispatch();

  const [getToastID, setToastID] = useState<null | string | number>(null);
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [otp, setOTP] = useState(null);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [password, setPassword] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const onSubmit = async (data: userPassword) => {
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      if (getToastID === null) {
        let a = toast.error("Your password and confirmation must match.");
        setToastID(a);
      } else {
        let b = toast.update(getToastID, {
          type: "error",
          render: "Your password and confirmation must match.",
          isLoading: false,
          autoClose: 300,
        });
        if (b === undefined) {
          let a = toast.error("Your password and confirmation must match.");
          setToastID(a);
        }
      }
    } else {
      let a = await dispatch(applyForOTP(data));
      if (a.payload) {
        setPassword(data?.password);
        setTime(Date.now() + 300000);
        setShowOTP(true);
      }
      console.log(a);
    }
  };
  const handleExpired = () => {
    setDisableBtn(true);
  };
  const handleVerifyOTP = async (e: string) => {
    if (disableBtn) {
      return;
    }
    let r = await dispatch(
      verifyOTPForChangePassword({ otp: e ? e : otp, password })
    );
    if (r.payload) handleCloseDialog();
  };
  const handleCloseDialog = () => {
    setToastID(null);
    setShowOTP(false);
    setOTP(null);
    setDisableBtn(false);
    setPassword(null);
    setTime(null);
    reset();
    closeDialog();
  };
  return (
    <Dialog open={open}>
      <DialogTitle>Changing Of Password</DialogTitle>
      <DialogContent>
        {!showOTP && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="submit"
          >
            <FormControl fullWidth>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                type={!showPass ? "password" : "text"}
                placeholder=""
                autoFocus
                required
                fullWidth
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPass
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={() => {
                            setShowPass(!showPass);
                          }}
                          edge="end"
                        >
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 6,
                    message: "At least 6 characters required",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
                    message:
                      "Must include uppercase, lowercase  number, and special character",
                  },
                })}
                // value={details.password}
                // onChange={(e) => {
                //   setDetails(() => ({ ...details, ["password"]: e.target.value }));
                //   console.log(details);
                // }}
                // value={formData.firstname}
                // onChange={(event) => handleInputChange(event)}
              />

              {errors &&
                errors.password &&
                errors.password.type === "required" && (
                  <FormHelperText sx={{ color: "red" }}>
                    Required
                  </FormHelperText>
                )}
              {errors &&
                errors.password &&
                errors.password.message &&
                errors.password.message !== "" && (
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.password.message}
                  </FormHelperText>
                )}
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="password">Confirm Password</FormLabel>
              <TextField
                type="password"
                placeholder=""
                autoFocus
                required
                fullWidth
                onCopy={(e) => {
                  e.preventDefault();
                }}
                onPaste={(e) => {
                  e.preventDefault();
                }}
                variant="outlined"
                {...register("confirmPassword", {
                  required: true,
                  minLength: {
                    value: 6,
                    message: "At least 6 characters required",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
                    message:
                      "Must include uppercase, lowercase  number, and special character",
                  },
                })}
                // value={details.password}
                // onChange={(e) => {
                //   setDetails(() => ({ ...details, ["password"]: e.target.value }));
                //   console.log(details);
                // }}
                // value={formData.firstname}
                // onChange={(event) => handleInputChange(event)}
              />

              {errors &&
                errors.confirmPassword &&
                errors.confirmPassword.type === "required" && (
                  <FormHelperText sx={{ color: "red" }}>
                    Required
                  </FormHelperText>
                )}
              {errors &&
                errors.confirmPassword &&
                errors.confirmPassword.message &&
                errors.confirmPassword.message !== "" && (
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.confirmPassword.message}
                  </FormHelperText>
                )}
            </FormControl>
          </form>
        )}
        {showOTP && (
          <Grid2
            container
            spacing={1}
          >
            <Grid2 size={{ lg: 12, md: 12 }}>
              <FormControl fullWidth>
                <FormLabel htmlFor="password">OTP</FormLabel>
                <MuiOtpInputStyled
                  className="MuiOtpInput-TextField"
                  TextFieldsProps={{ placeholder: "-" }}
                  value={!otp ? "" : otp}
                  autoFocus
                  onChange={(e: any) => {
                    if (!disableBtn) {
                      setOTP(e);
                      if (e.length === 6) {
                        handleVerifyOTP(e);
                      }
                    } else {
                      setOTP(null);
                    }
                  }}
                  length={6}
                />
              </FormControl>
            </Grid2>
            {time && (
              <Grid2
                size={{ lg: 12, md: 12 }}
                sx={{ textAlign: "center" }}
              >
                <Typography variant="caption">
                  This OTP will be Expired In
                </Typography>

                <Countdown
                  // date={Date.now() + 300000}
                  date={time}
                  onComplete={handleExpired}
                  renderer={({ minutes, seconds, completed }) => {
                    if (!completed)
                      return (
                        <Typography variant="h2">
                          {minutes}:{seconds}
                        </Typography>
                      );
                    else
                      return (
                        <Typography
                          variant="h2"
                          color="error"
                        >
                          Expired
                        </Typography>
                      );
                  }}
                ></Countdown>
              </Grid2>
            )}
          </Grid2>
        )}
      </DialogContent>
      <DialogActions>
        {!showOTP && (
          <Button
            type="submit"
            form="submit"
          >
            Save
          </Button>
        )}
        <Button
          onClick={() => {
            handleCloseDialog();
          }}
        >
          {" "}
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
