//@ts-nocheck
import {
  Card,
  Typography,
  Button,
  Box,
  Grid2,
  FormControl,
  FormLabel,
  TextField,
  FormHelperText,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import rectangle from "@/assets/images/Rectangle 6691.png";
import { useSelector } from "react-redux";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PhoneInput, { CountryData } from "react-phone-input-2";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { showToaster } from "@/redux/reducers/global/globalSlice";
import { getUser } from "@/redux/reducers/user/asnycCalls";
import Avatar from "@mui/material/Avatar";

import { RootState } from "@/redux/store";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";
import ProfileDialog from "./ProfileDialog";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";

const base_url = import.meta.env.VITE_API_BASE_URL;
const endpoint = base_url + "api/file/serve/image/";

const main = () => {
  const dispatch = useAppDispatch();
  const userDetails = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState(userDetails);
  const [phoneError, setPhoneError] = useState("");
  const { token } = useAppSelector((state) => state.token);

  useEffect(() => {
    setFormData(userDetails);
  }, [userDetails]);
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | moment.Moment,
    name?: string
  ) => {
    if (moment.isMoment(event)) {
      // If the change comes from DateTimePicker
      setFormData((prevData) => ({
        ...prevData,
        [name as string]: event ? event.toISOString() : null, // Store as ISO string
      }));
    } else {
      // Regular input change
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (JSON.stringify(userDetails) === JSON.stringify(formData)) return;
    try {
      console.log(formData);
      let res = await apiService.updateAdmin(formData, token);

      const d = bodyDecrypt(res.data, token);

      if (d && d.success === "success") {
        dispatch(
          showToaster({
            message: "Profile updated successfuly",
            show: true,
            variant: "success",
            icon: null,
          })
        );
        dispatch(getUser());
      } else {
        dispatch(
          showToaster({
            message: d.message,
            show: true,
            variant: "error",
            icon: null,
          })
        );
      }
    } catch (err) {
      dispatch(showToaster({ err, variant: "error", icon: "error" }));
      return false;
    }
  };

  const [refreshKey, setRefreshKey] = useState(0);
  // Call this function when data updates
  const refreshImage = () => setRefreshKey((prev) => prev + 1);

  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleClose = (val) => {
    setOpen(!val);
  };

  const handleSubmitImage = () => {
    setOpen(false);
    dispatch(getUser());
    refreshImage();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    setFormData((prev) => ({
      ...prev,
      file: acceptedFiles,
    }));
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
  return (
    <>
      <Box></Box>
      <Card
        sx={{
          borderRadius: "15px",
          overflow: "auto",
          padding: 0,
          border: "transparent",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100px",
            flexShrink: "0",
            background: `url(${rectangle}) lightgray 50% / cover no-repeat`,
          }}
        ></Box>

        <Box
          sx={{
            background: "#fff",
            padding: "35px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              marginBottom: "35px",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100px",
                height: "100px",
                borderRadius: "100%",
                overflow: "hidden",
                cursor: "pointer",
                "&:hover .overlay": {
                  display: "flex !important",
                },
              }}
            >
              <Button
                onClick={handleOpenDialog}
                className="overlay"
                style={{
                  position: "absolute",
                  display: "none",
                  justifyContent: "center",
                  alignItems: "center",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0, 0.7)",
                  color: "#fff",
                  zIndex: 100,
                }}
              >
                <CameraAlt />
              </Button>

              <Avatar
                sizes="small"
                alt="Riley Carter"
                src={
                  formData.fileInfo && formData.fileInfo.id
                    ? endpoint + formData.fileInfo.id + `?t=${refreshKey}`
                    : ""
                }
                sx={{ width: "100px", height: "100px" }}
              />

              {/* <CardMedia
                                component="img"
                                sx={{ height: '113px' }}
                                image={}
                                alt="Paella dish"
                            /> */}
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "#000",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {formData.fullname}
              </Typography>
              <Typography
                sx={{
                  color: "#000",
                  fontSize: "16px",
                  fontWeight: "400",
                  opacity: "0.5",
                }}
              >
                {formData.emailAddress}
              </Typography>
            </Box>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid2
              container
              spacing={3}
              columns={12}
            >
              <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="firstname">Given Name</FormLabel>
                  <TextField
                    type="text"
                    name="firstname"
                    placeholder=""
                    autoComplete="firstname"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    value={formData.firstname}
                    onChange={(event) => handleInputChange(event)}
                  />
                  {formData.firstname?.trim() === "" && (
                    <FormHelperText sx={{ color: "red" }}>
                      Required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="lastname">Family Name</FormLabel>
                  <TextField
                    type="text"
                    name="lastname"
                    placeholder=""
                    autoComplete="lastname"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    value={formData.lastname}
                    onChange={(event) => handleInputChange(event)}
                  />
                  {formData.lastname?.trim() === "" && (
                    <FormHelperText sx={{ color: "red" }}>
                      Required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="mobileNumber">Mobile Number</FormLabel>
                  <PhoneInput
                    value={formData.mobileNumber}
                    country={"ph"}
                    onChange={(phone) =>
                      setFormData((prev) => ({
                        ...prev,
                        mobileNumber: phone,
                      }))
                    }
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
                    onBlur={(phone, e: CountryData) => {
                      const mobileNumber = phone.target.value.replace(
                        /[+\s]/g,
                        ""
                      ).length;
                      const totalLength = e.format.replace(/[+\s]/g, "").length;
                      if (totalLength - 1 > mobileNumber || mobileNumber <= 2) {
                        setPhoneError("Invalid mobile number");
                      } else {
                        setPhoneError("");
                      }
                    }}
                  />
                  {phoneError && (
                    <FormHelperText sx={{ color: "red" }}>
                      {phoneError}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="birthdate">Birth Date</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      views={["year", "month", "day"]}
                      name="birthdate"
                      onChange={(date: any) =>
                        handleInputChange(date, "birthdate")
                      } // Pass name explicitly
                      value={
                        formData.birthdate
                          ? moment(formData.birthdate)
                          : moment()
                      }
                    />
                  </LocalizationProvider>
                  {/* <TextField
                                        type="text"
                                        name="details"
                                        placeholder=""
                                        autoComplete="details"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        value={formData.birthdate}
                                    /> */}
                  {!formData.birthdate && (
                    <FormHelperText sx={{ color: "red" }}>
                      Required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="details">Email</FormLabel>
                  <TextField
                    type="text"
                    name="details"
                    placeholder=""
                    autoComplete="details"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    value={formData.emailAddress}
                  />
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Divider></Divider>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="details">
                    House/Building Number and Street Name
                  </FormLabel>
                  <TextField
                    type="text"
                    name="hbnandstr"
                    placeholder="123 Sampaloc Street"
                    autoComplete="hbnandstr"
                    autoFocus
                    fullWidth
                    variant="outlined"
                    value={formData.hbnandstr}
                    onChange={(event) => handleInputChange(event)}
                  />
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="details">Barangay</FormLabel>
                  <TextField
                    type="text"
                    name="barangay"
                    placeholder="Calumpang"
                    autoComplete="barangay"
                    autoFocus
                    fullWidth
                    variant="outlined"
                    value={formData.barangay}
                    onChange={(event) => handleInputChange(event)}
                  />
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="details">City</FormLabel>
                  <TextField
                    type="text"
                    name="city"
                    placeholder="Cabanatuan"
                    autoComplete="city"
                    autoFocus
                    fullWidth
                    variant="outlined"
                    // value={formData.emailAddress}
                    value={formData.city}
                    onChange={(event) => handleInputChange(event)}
                  />
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="details">Province</FormLabel>
                  <TextField
                    type="text"
                    name="province"
                    placeholder="Nueva Ecija"
                    autoComplete="province"
                    autoFocus
                    fullWidth
                    variant="outlined"
                    value={formData.province}
                    onChange={(event) => handleInputChange(event)}
                  />
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <FormLabel htmlFor="details">Upload valid ID</FormLabel>
                <Paper
                  elevation={0}
                  sx={{
                    borderStyle: "dashed",
                    borderWidth: "4px",
                    borderColor: "#cacfdb",
                    padding: "2%",
                    borderRadius: "25px",
                    marginTop: 1,
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
                            {formData.file && formData.file.length > 0
                              ? formData.file[0].name
                              : "Browse File"}
                          </Button>
                        </Box>
                        <Box>
                          <Typography>
                            {formData.file && formData.file.length > 0
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
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="info"
                  sx={{ px: 4 }}
                >
                  Edit
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </Box>
      </Card>
      <ProfileDialog
        open={open}
        fileInfo={formData.fileInfo}
        onClose={handleClose}
        onSubmit={handleSubmitImage}
      />
    </>
  );
};

export default main;
