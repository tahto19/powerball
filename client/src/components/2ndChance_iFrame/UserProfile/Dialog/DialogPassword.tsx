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
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
// import { useState } from "react";

export default function DialogPassword({ open }: { open: boolean }) {
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<userPassword>({
    mode: "onChange", // Validates on input change
  });
  const [getToastID, setToastID] = useState<null | string | number>(null);
  const onSubmit = (data: userPassword) => {
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
    }
  };
  return (
    <Dialog open={true}>
      <DialogTitle>Changing Of Password</DialogTitle>
      <DialogContent>
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
                required: false,
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
                <FormHelperText sx={{ color: "red" }}>Required</FormHelperText>
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
            <FormLabel htmlFor="password">Password</FormLabel>
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
                required: false,
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
                <FormHelperText sx={{ color: "red" }}>Required</FormHelperText>
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
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          form="submit"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
