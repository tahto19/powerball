import * as React from 'react';
import { CircularProgress, Card, CardContent, TextField, CardActions, Grid2, FormControl, FormLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { showToaster } from "@/redux/reducers/global/globalSlice";
import { useAppDispatch, } from "@/redux/hook";
import apiService from "@/services/apiService";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MuiOtpInput } from "mui-one-time-password-input";

const base_url = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
    const [show, setShow] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [sendOTP, setSendOTP] = React.useState(false);

    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState("");
    const dispatch = useAppDispatch();
    const [loading, setLoading] = React.useState(false)


    const validateInputs = () => {
        let isValid = true;

        if (confirmPassword !== password) {
            setConfirmPasswordErrorMessage("Confirm Password does not match.");
            return false;
        }

        setConfirmPasswordErrorMessage("");

        return isValid;
    };

    const [otp, setOTP] = React.useState("");

    const [mobileNumber, setMobileNumber] = React.useState("");
    const [mobileNumberError, setMobileNumberError] = React.useState(false);
    const [mobileNumberErrorMessage, setMobileNumberErrorMessage] = React.useState("");
    const validateNumberInput = () => {
        const mobileNumber = document.getElementById(
            "mobileNumber"
        ) as HTMLInputElement;
        // const password = document.getElementById("password") as HTMLInputElement;

        let isValid = true;

        if (!mobileNumber.value) {
            setMobileNumberError(true);
            setMobileNumberErrorMessage("Please enter a mobile number.");
            isValid = false;
        } else {
            setMobileNumberError(false);
            setMobileNumberErrorMessage("");
        }

        // if (!password.value || password.value.length < 6) {
        //     setPasswordError(true);
        //     setPasswordErrorMessage("Password must be at least 6 characters long.");
        //     isValid = false;
        // } else {
        //     setPasswordError(false);
        //     setPasswordErrorMessage("");
        // }
        return isValid;
    };

    const handleMobileNumberSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            if (!validateNumberInput()) return;
            if (!validateInputs()) return;

            if (mobileNumberError) {
                return;
            }
            const formData = new FormData(event.currentTarget);

            const mobileNumber = formData.get("mobileNumber") as string; // ✅ Ensure it's a string

            const res = await apiService.resetOtp({ mobileNumber });

            if (res.data.result == "success") {
                setSendOTP(true);
            }

        } catch (err) {
            dispatch(
                showToaster({
                    err,
                    show: true,
                    variant: "error",
                    icon: null,
                })
            );
        }
    };

    const handleVerifyOTP = async () => {
        try {
            if (!validateNumberInput()) return;
            if (!validateInputs()) return;
            if (!otp || otp.trim() === "") {
                return;
            }



            const res = await apiService.verifyOtp({ mobileNumber, otp, password });

            if (res.data.result == "success") {
                setShow(true)
            }

        } catch (err) {
            dispatch(
                showToaster({
                    err,
                    show: true,
                    variant: "error",
                    icon: null,
                })
            );
        }
    };
    return (
        <div style={{
            display: "flex",
            justifyContent: "center"
        }}>

            {show ? (<Card sx={{ maxWidth: 700, marginTop: 1 }} elevation={0} >
                <CardContent sx={{ height: "calc(100% - 40px)", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ fontSize: "5rem", color: "#61CE70" }} />
                    <Typography sx={{ fontSize: "2rem", color: "#61CE70" }}>Password Changed!!</Typography>
                    <Button onClick={() => {
                        window.parent.location.href = base_url + "member-area/"
                    }} variant="contained" sx={{ marginTop: "30px" }}>Back to Login</Button>
                </CardContent>
            </Card>) :
                sendOTP ? (
                    <Card sx={{ width: "100%", maxWidth: 700, marginTop: 1 }}>
                        <form
                            className="elementor-login elementor-form"
                            onSubmit={handleMobileNumberSubmit}
                        >
                            <CardContent >
                                <Typography gutterBottom variant="h5" textAlign={"center"} component="div">
                                    Enter OTP
                                </Typography>
                                <br />
                                <Grid2
                                    container
                                    spacing={2}
                                    columns={12}
                                >
                                    <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
                                        <MuiOtpInput
                                            TextFieldsProps={{
                                                inputProps: {
                                                    inputMode: "numeric",
                                                    pattern: "[0-9]*",
                                                },
                                                variant: "outlined",
                                                size: "small",
                                                sx: { width: 40, mx: 0.5 }, // custom styling
                                            }}
                                            value={otp}
                                            onChange={(e) => {
                                                setOTP(e);
                                                if (e.length === 6) {
                                                    handleVerifyOTP();
                                                }
                                            }}
                                            length={6}
                                        />
                                    </Grid2>
                                </Grid2>
                            </CardContent>
                            <CardActions sx={{
                                justifyContent: "end"
                            }}>
                                {/* <Button onClick={handleClose} size="small" sx={{ padding: "5px 20px", background: "#e4e6eb", color: "#000", fontWeight: "600" }}>Close</Button> */}
                                {/* <Button disabled={loading} type='submit' size="small" variant="contained" disableElevation sx={{ padding: "5px 20px", background: "#61CE70", fontWeight: "600" }}>{loading ? (<CircularProgress size="1.5rem" />) : "Submit"}</Button> */}
                            </CardActions>
                        </form>
                    </Card>
                ) :

                    (


                        <Card sx={{ maxWidth: 700, marginTop: 1 }}>
                            <form
                                className="elementor-login elementor-form"
                                onSubmit={handleMobileNumberSubmit}
                            >
                                <CardContent >
                                    <Typography gutterBottom variant="h5" component="div">
                                        Change Password
                                    </Typography>
                                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                        Please enter your registered mobile number and your new password. You’ll receive a verification code on your mobile phone to complete the process.
                                    </Typography>
                                    <br />
                                    <Grid2
                                        container
                                        spacing={2}
                                        columns={12}
                                    >

                                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                            <FormControl
                                                sx={{
                                                    display: "flex",
                                                }}>
                                                <FormLabel htmlFor="mobileNumber">Mobile Number</FormLabel>
                                                <TextField
                                                    value={mobileNumber}
                                                    onChange={(e) => {
                                                        setMobileNumber(e.target.value);
                                                    }}
                                                    error={mobileNumberError}
                                                    helperText={mobileNumberErrorMessage}
                                                    id="mobileNumber"
                                                    type="mobileNumber"
                                                    name="mobileNumber"
                                                    placeholder="6391 *** *** * / 091 *** *** *"
                                                    autoFocus
                                                    required
                                                    size='small'
                                                    fullWidth
                                                    variant="outlined"
                                                    color={
                                                        mobileNumberError ? "error" : "primary"
                                                    }
                                                />
                                            </FormControl>
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                            <FormControl
                                                sx={{
                                                    display: "flex",
                                                }}>
                                                <FormLabel htmlFor="password">New Password</FormLabel>
                                                <TextField
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    placeholder="Enter your new password"
                                                    autoComplete="password"
                                                    autoFocus
                                                    required
                                                    size='small'
                                                    fullWidth
                                                    variant="outlined"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === " ") e.preventDefault();
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                            <FormControl sx={{
                                                display: "flex",
                                            }}>
                                                <FormLabel htmlFor="password">Confirm Password</FormLabel>
                                                <TextField
                                                    error={confirmPasswordErrorMessage !== ""}
                                                    helperText={confirmPasswordErrorMessage}
                                                    id="confirm-password"
                                                    type="password"
                                                    name="confirm-password"
                                                    placeholder="Re-Enter your new password"
                                                    autoComplete="confirm-password"
                                                    autoFocus
                                                    required
                                                    size='small'
                                                    fullWidth
                                                    variant="outlined"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === " ") e.preventDefault();
                                                    }}
                                                    color={confirmPasswordErrorMessage !== "" ? "error" : "primary"}
                                                />
                                            </FormControl>
                                        </Grid2>
                                    </Grid2>
                                </CardContent>
                                <CardActions sx={{
                                    justifyContent: "end"
                                }}>
                                    {/* <Button onClick={handleClose} size="small" sx={{ padding: "5px 20px", background: "#e4e6eb", color: "#000", fontWeight: "600" }}>Close</Button> */}
                                    <Button disabled={loading} type='submit' size="small" variant="contained" disableElevation sx={{ padding: "5px 20px", background: "#61CE70", fontWeight: "600" }}>{loading ? (<CircularProgress size="1.5rem" />) : "Submit"}</Button>
                                </CardActions>
                            </form>
                        </Card>
                    )}


        </div>
    );
}

export default ResetPassword;