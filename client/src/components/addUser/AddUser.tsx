import React, { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addUser } from "../../redux/reducers/user/userSlice";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Divider,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AnimatedContent from "@/animated/AnimatedContent.tsx";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDropzone } from "react-dropzone";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhoneInput from "react-phone-input-2";
import moment from "moment";
import "react-phone-input-2/lib/style.css";
import { userState } from "./Types.ts";
import { useAppDispatch } from "@/redux/hook.ts";
import { outsideAddUser } from "@/redux/reducers/user/asnycCalls.ts";
const AddUser = () => {
  const dispatch = useAppDispatch();
  // const { fullname, emailAddress, birthdate, idImage, loading } = useSelector(
  //   (state: RootState) => state.user
  // );
  const [fileD, setFileD] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<userState>();

  register("birthdate", { required: true });
  register("file", { required: true });
  register("mobileNumber", { required: true });
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);
    setValue("file", acceptedFiles);
    setFileD(acceptedFiles);
    console.log(fileD);
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

  const onSubmit: SubmitHandler<userState> = (data) =>
    dispatch(outsideAddUser(data));
  const onError: SubmitErrorHandler<userState> = (error) => console.log(error);
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
      <Grid container spacing={1}>
        <form onSubmit={handleSubmit(onSubmit, onError)} id="my-form"></form>
        <Grid size={{ md: 4, xs: 12 }}>
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
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    sx={{ width: "100%" }}
                    id="outlined-basic"
                    label="First Name"
                    variant="outlined"
                    size="medium"
                    {...register("firstname", { required: true })}
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
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Email Address"
                    variant="outlined"
                    size="medium"
                    {...register("emailAddress", { required: true })}
                  />
                  {errors &&
                    errors.emailAddress &&
                    errors.emailAddress.type &&
                    errors.emailAddress.type === "required" && (
                      <FormHelperText sx={{ color: "red" }}>
                        Required
                      </FormHelperText>
                    )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <PhoneInput
                    country={"ph"}
                    inputStyle={{
                      border: "1px solid #c4c4c4",
                      height: "100%",
                      width: "100%",
                      minHeight: "40px",
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
                      setValue("mobileNumber", phone);
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
                </Grid>
              </Grid>
            </Grid>
            <Grid size={11}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Birthdate"
                    sx={{ width: "100%" }}
                    onChange={(e) => {
                      setValue("birthdate", moment(e).toISOString());
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {errors &&
                errors.birthdate &&
                errors.birthdate.type &&
                errors.birthdate.type === "required" && (
                  <FormHelperText sx={{ color: "red" }}>
                    Required
                  </FormHelperText>
                )}
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ md: 7, xs: 12 }} sx={{ justifyContent: "center" }}>
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
                          {fileD && fileD[0] && fileD[0].name
                            ? fileD[0].name
                            : "Browse File"}
                        </Button>
                      </Box>
                      <Box>
                        <Typography>
                          {fileD && fileD[0] && fileD[0].name
                            ? "Change"
                            : "Choose"}{" "}
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
        <Grid size={12} sx={{ marginTop: "25px" }}></Grid>
        <Grid size={{ md: 2, xs: 12 }} sx={{ textAlign: "center" }}>
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
          >
            Next{" >"}
          </Button>
        </Grid>
        <Grid size={1}></Grid>
      </Grid>
    </AnimatedContent>
  );
};

export default AddUser;
