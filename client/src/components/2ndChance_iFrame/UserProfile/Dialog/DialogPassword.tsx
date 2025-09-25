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
// import { useState } from "react";
type userPassword = {
  password: null | string;
  confirmPassword: null | string;
};
export default function DialogPassword({ open }: { open: boolean }) {
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<userPassword>({
    mode: "onChange", // Validates on input change
  });

  return (
    <Dialog open={true}>
      <DialogTitle>Changing Of Password</DialogTitle>
      <DialogContent>
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
                        showPass ? "hide the password" : "display the password"
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

          {errors && errors.password && errors.password.type === "required" && (
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
                        showPass ? "hide the password" : "display the password"
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

          {errors && errors.password && errors.password.type === "required" && (
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
      </DialogContent>
      <DialogActions>
        <Button>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
