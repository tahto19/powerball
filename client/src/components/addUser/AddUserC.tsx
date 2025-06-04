import { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";
import { editDetails } from "../../redux/reducers/user/userSlice.ts";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDropzone } from "react-dropzone";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhoneInput, { CountryData } from "react-phone-input-2";
import moment from "moment";
import "react-phone-input-2/lib/style.css";
import { userState } from "./TypesHere.ts";
import { useAppDispatch } from "@/redux/hook.ts";
import { outsideAddUser } from "@/redux/reducers/user/asnycCalls.ts";
const AddUserC = () => {
  const dispatch = useAppDispatch();
  const {
    firstname,
    lastname,
    emailAddress,
    birthdate,
    file,
    mobileNumber,
    otpID,
    loading,
  } = useSelector((state: RootState) => state.user);
  const {
    getValues,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<userState>({
    mode: "onChange", // Validates on input change
  });

  // register("birthdate", { required: true });
  // register("file", { required: true });
  // register("mobileNumber", { required: true });
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files

    setValue("file", acceptedFiles, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, []);
  useEffect(() => {
    if (firstname || lastname || emailAddress || birthdate || mobileNumber) {
      setValue("firstname", firstname, { shouldValidate: true });
      setValue("lastname", lastname, { shouldValidate: true });
      setValue("emailAddress", emailAddress, { shouldValidate: true });
      setValue("birthdate", birthdate, { shouldValidate: true });
      setValue("file", file?.length === 0 ? null : file, {
        shouldValidate: true,
      });
      setValue("mobileNumber", mobileNumber, { shouldValidate: true });
    } else {
      register("birthdate", { required: true });
      register("file", { required: false });
      register("mobileNumber", { required: true });
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    onDrop,
    multiple: false,
  });

  const onSubmit: SubmitHandler<userState> = (data) => {
    if (!otpID) dispatch(outsideAddUser(data));
    else dispatch(editDetails(data));
  };
  const [showPassword, setShowPassword] = useState(false);
  const onError: SubmitErrorHandler<userState> = (error) => console.log(error);
  return (
    <Grid
      container
      spacing={1}
    >
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        id="my-form"
      ></form>
      <Grid size={{ md: 7, xs: 12 }}>
        <Grid
          container
          spacing={2}
          direction="column"
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid size={6}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Create Account
            </Typography>
          </Grid>
          <Grid size={11}>
            <Grid
              container
              spacing={1}
            >
              <Grid size={{ xs: 12, md: 7 }}>
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  size="medium"
                  {...register("firstname", {
                    required: true,
                  })}
                />
                {errors &&
                  errors.firstname &&
                  errors.firstname.type &&
                  errors.firstname.type === "required" && (
                    <FormHelperText sx={{ color: "red" }}>
                      Required
                    </FormHelperText>
                  )}{" "}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Last Name"
                  variant="outlined"
                  size="medium"
                  {...register("lastname", { required: true })}
                />
                {errors &&
                  errors.lastname &&
                  errors.lastname.type &&
                  errors.lastname.type === "required" && (
                    <FormHelperText sx={{ color: "red" }}>
                      Required
                    </FormHelperText>
                  )}
              </Grid>
            </Grid>
          </Grid>

          <Grid size={11}>
            <Grid
              container
              spacing={1}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Email Address"
                  variant="outlined"
                  size="medium"
                  {...register("emailAddress", {
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address",
                    },
                  })}
                />
                {errors &&
                  errors.emailAddress &&
                  errors.emailAddress.type &&
                  errors.emailAddress.type === "required" && (
                    <FormHelperText sx={{ color: "red" }}>
                      Required
                    </FormHelperText>
                  )}
                {errors && errors.emailAddress && (
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.emailAddress.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                ></TextField>
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
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <PhoneInput
                  value={getValues("mobileNumber")}
                  country={"ph"}
                  inputStyle={{
                    border: "1px solid #c4c4c4",
                    height: "100%",
                    width: "100%",
                    minHeight: "40px",
                  }}
                  inputProps={{
                    name: "phone",
                    required: true,
                    autoFocus: true,
                  }}
                  containerStyle={{
                    minHeight: "40px",
                    height:
                      errors &&
                      errors.mobileNumber &&
                      errors.mobileNumber &&
                      errors.mobileNumber.type &&
                      errors.mobileNumber.type === "required"
                        ? "70%"
                        : "100%",
                  }}
                  // value={this.state.phone}
                  onChange={(phone) => {
                    setValue("mobileNumber", phone, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  onBlur={(phone, e: CountryData) => {
                    const mobileNumber = phone.target.value.replace(
                      /[+\s]/g,
                      ""
                    ).length;
                    const totalLength = e.format.replace(/[+\s]/g, "").length;

                    if (totalLength - 1 > mobileNumber || mobileNumber <= 2) {
                      setError("mobileNumber", {
                        type: "mobileNumberLength",
                        message: "Mobile Number is incorrect",
                      });
                    } else {
                      clearErrors("mobileNumber");
                    }
                  }}
                />
                {errors &&
                  errors.mobileNumber &&
                  errors.mobileNumber.type &&
                  errors.mobileNumber.type === "required" && (
                    <FormHelperText sx={{ color: "red" }}>
                      Required
                    </FormHelperText>
                  )}
                {errors &&
                  errors.mobileNumber &&
                  errors.mobileNumber.message && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.mobileNumber.message}
                    </FormHelperText>
                  )}
              </Grid>
            </Grid>
          </Grid>
          <Grid size={11}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Birthdate"
                  value={moment(getValues("birthdate"))}
                  sx={{ width: "100%" }}
                  onChange={(e) => {
                    setValue("birthdate", moment(e).toISOString(), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            {errors &&
              errors.birthdate &&
              errors.birthdate.type &&
              errors.birthdate.type === "required" && (
                <FormHelperText sx={{ color: "red" }}>Required</FormHelperText>
              )}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        size={{ md: 4, xs: 12 }}
        sx={{ justifyContent: "center" }}
      >
        <Stack spacing={1}>
          <Box>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Upload valid id
            </Typography>
          </Box>
          <Box>
            <Divider sx={{ borderWidth: "3px" }} />
          </Box>
          <Box>
            <Paper
              elevation={0}
              sx={{
                borderStyle: "dashed",
                borderWidth: "15px",
                borderColor: "#cacfdb",
                padding: "2%",
                borderRadius: "25px",
              }}
            >
              <div {...getRootProps()}>
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <Stack
                    spacing={0}
                    sx={{ justifyContent: "center", textAlign: "center" }}
                  >
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 45 }} />
                    </Box>
                    <Box>
                      <Button
                        variant="outlined"
                        sx={{
                          borderRadius: "30px",
                          color: "black",
                          fontWeight: "bold",
                          borderColor: "#cacfdb",
                          borderWidth: "medium",
                        }}
                      >
                        {getValues("file") && getValues("file")?.length !== 0
                          ? getValues("file")?.[0].name
                          : "Browse File"}
                      </Button>
                    </Box>
                    <Box>
                      <Typography>
                        {errors &&
                          errors.file &&
                          errors.file.type &&
                          errors.file.type === "required" && (
                            <span style={{ color: "red" }}>Required </span>
                          )}
                        {getValues("file") && getValues("file")?.length !== 0
                          ? "Change "
                          : "Choose "}
                        a file or drag & drop it here
                      </Typography>
                      <Typography sx={{ color: "#cacfdb" }}>
                        JPEG,PNG formats, up to 50MB
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </div>
              <input {...getInputProps()} />
            </Paper>
          </Box>
        </Stack>
      </Grid>
      <Grid
        size={12}
        sx={{ marginTop: "25px" }}
      ></Grid>
      <Grid
        size={{ md: 2, xs: 12 }}
        sx={{ textAlign: "center" }}
      >
        <Typography>
          By creating an account or signing you agree to our{" "}
          <Tooltip title="Click me!">
            <span
              style={{
                fontWeight: "bolder",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Terms and Conditions
            </span>
          </Tooltip>
        </Typography>
      </Grid>
      <Grid size={{ md: 7, xs: 0 }}></Grid>
      <Grid size={{ md: 2, xs: 12 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            background: "#000000",
            border: "none",
            fontWeight: "bolder",
            fontSize: "16px",
          }}
          type="submit"
          form="my-form"
          loading={loading}
        >
          Next{" >"}
        </Button>
      </Grid>
      <Grid size={1}></Grid>
    </Grid>
  );
};

export default AddUserC;
