import * as React from 'react';
import { Card, CardContent, TextField, CardActions, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { showToaster } from "@/redux/reducers/global/globalSlice";
import { useAppDispatch } from "@/redux/hook";
import apiService from "@/services/apiService";

const ForgotPassword = () => {
    const dispatch = useAppDispatch();
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
    const handleClose = () => {
        window.parent.location.href = "https://18.138.76.86/member-area/";
    };
    const [loading, setLoading] = React.useState(false)
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        try {
            setLoading(true)
            event.preventDefault();
            if (!validateInputs()) return;
            if (emailError) return;

            const formData = new FormData(event.currentTarget);

            const email = formData.get("email") as string; // ✅ Ensure it's a string

            const res = await apiService.forgotPassword({ email });
            if (res.data.success === "success") {
                dispatch(showToaster({
                    message: "Reset link sent to your email.",
                    show: true,
                    variant: "success",
                    icon: null,
                }))
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
        } finally {
            setLoading(false)
        }
    };
    const validateInputs = () => {
        const email = document.getElementById("email") as HTMLInputElement;
        let isValid = true;
        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }
        return isValid;
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center"
        }}>
            <Card sx={{ maxWidth: 700, marginTop: 1 }}>
                <form
                    className="elementor-login elementor-form"
                    onSubmit={handleSubmit}
                >
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Find Your Account
                        </Typography>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Enter your registered email below to receive password reset instructions.
                        </Typography>
                        <br />
                        <TextField
                            error={emailError}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email address"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={emailError ? "error" : "primary"}
                        />
                    </CardContent>
                    <CardActions sx={{
                        justifyContent: "end",
                        marginBottom: 1
                    }}>
                        <Button onClick={handleClose} size="small" sx={{ padding: "5px 20px", background: "#e4e6eb", color: "#000", fontWeight: "600" }}>Close</Button>
                        <Button disabled={loading} type='submit' size="small" variant="contained" disableElevation sx={{ padding: "5px 20px", background: "#61CE70", fontWeight: "600" }}>{loading ? (<CircularProgress size="1.5rem" />) : "Send"}</Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
}

export default ForgotPassword;