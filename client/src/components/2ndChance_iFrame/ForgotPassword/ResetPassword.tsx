import * as React from 'react';
import { CircularProgress, Card, CardContent, TextField, CardActions, Grid2, FormControl, FormLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { showToaster } from "@/redux/reducers/global/globalSlice";
import { useAppDispatch, } from "@/redux/hook";
import apiService from "@/services/apiService";
import { useSearchParams } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const base_url = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [token, setToken] = React.useState<string | null>("");
    const [show, setShow] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState("");
    const dispatch = useAppDispatch();
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true)

            event.preventDefault();
            if (!validateInputs()) return;

            const data = {
                token,
                password
            }

            const res = await apiService.resetPassword(data);

            if (res.data.success === "success") {
                setShow(true)
            }
        } catch (err) {
            setShow(false)
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
    }

    const handleClose = () => {

    }

    const validateInputs = () => {
        let isValid = true;

        if (confirmPassword !== password) {
            setConfirmPasswordErrorMessage("Confirm Password does not match.");
            return false;
        }

        setConfirmPasswordErrorMessage("");

        return isValid;
    };

    React.useEffect(() => {
        const parentSearchParams = new URLSearchParams(window.parent.location.search);
        const tokenFromUrl = parentSearchParams.get("token");
        setToken(tokenFromUrl);
    }, [searchParams])
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
            </Card>) : (
                <Card sx={{ maxWidth: 700, marginTop: 1 }}>
                    <form
                        className="elementor-login elementor-form"
                        onSubmit={handleSubmit}
                    >
                        <CardContent >
                            <Typography gutterBottom variant="h5" component="div">
                                New Password
                            </Typography>
                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                Please enter your new password.
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
                                        <FormLabel htmlFor="password">New Password</FormLabel>
                                        <TextField
                                            id="password"
                                            type="password"
                                            name="password"
                                            placeholder="Enter your new password"
                                            autoComplete="password"
                                            autoFocus
                                            required
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
                            <Button onClick={handleClose} size="small" sx={{ padding: "5px 20px", background: "#e4e6eb", color: "#000", fontWeight: "600" }}>Close</Button>
                            <Button disabled={loading} type='submit' size="small" variant="contained" disableElevation sx={{ padding: "5px 20px", background: "#61CE70", fontWeight: "600" }}>{loading ? (<CircularProgress size="1.5rem" />) : "Submit"}</Button>
                        </CardActions>
                    </form>
                </Card>
            )}


        </div>
    );
}

export default ResetPassword;