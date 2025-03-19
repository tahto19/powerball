import React, { useCallback } from "react";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addUser } from "../../redux/reducers/user/userSlice";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import moment from "moment";
const AddUser = () => {
  const dispatch = useDispatch();
  const { fullname, emailAddress, birthdate, idImage, loading } = useSelector(
    (state: RootState) => state.user
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setValue("file", acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onSubmit = (data) => console.log(data);
  return (
    <Grid container spacing={1}>
      <Grid size={4}>
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
          <Grid size={10}>
            <TextField
              sx={{ width: "80%" }}
              id="outlined-basic"
              label="Full Name"
              variant="outlined"
              size="medium"
              {...(register("fullname"), { required: true })}
            />
          </Grid>
          <Grid size={10}>
            <TextField
              sx={{ width: "80%" }}
              id="outlined-basic"
              label="Email Address"
              variant="outlined"
              size="medium"
              {...(register("emailAddress"), { required: true })}
            />
          </Grid>
          <Grid size={10}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Birthdate"
                  sx={{ width: "80%" }}
                  onChange={(e) => {
                    setValue("birthday", moment(e).toISOString());
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={7} sx={{ justifyContent: "center" }}>
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
                        Browse File
                      </Button>
                    </Box>
                    <Box>
                      <Typography>
                        Choose a file or drag & drop it here
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
      <Grid size={2} sx={{ textAlign: "center" }}>
        <Typography>
          By creating an account or signing you agree to our Terms and
          Conditions
        </Typography>
      </Grid>
      <Grid size={7}></Grid>
      <Grid size={2}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            background: "#000000",
            border: "none",
            fontWeight: "bolder",
            fontSize: "16px",
          }}
        >
          Next{" >"}
        </Button>
      </Grid>
      <Grid size={1}></Grid>
    </Grid>
  );
};

export default AddUser;
