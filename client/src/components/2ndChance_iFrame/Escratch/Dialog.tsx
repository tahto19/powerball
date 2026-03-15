//@ts-nocheck
import apiService from "@/services/apiService";

import { useMediaQuery, useTheme } from "@mui/material";
import {
    AppBar,
    Toolbar,
    TextField,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
    Typography,
    IconButton,
    Divider,
    CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { bodyDecrypt } from "@/utils/util";
import { showToaster } from "@/redux/reducers/global/globalSlice";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
const EDialog = ({ points, open, onClose }: { points: number; open: boolean; onClose: () => void }) => {
    const { token } = useAppSelector((state) => state.token);
    const dispatch = useAppDispatch();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [myPoints, setPoints] = useState<number | null>(null)
    const [gems, setGems] = useState<number | null>(null)
    const [openConfirmation, setOpenConfirmation] = useState(false)
    const handleCloseConfirmation = () => {
        setOpenConfirmation(false)
    }

    const [openSuccess, setOpenSuccess] = useState(false)
    const [openRedirect, setOpenRedirect] = useState(false)
    const handleOnCloseRedirect = () => {
        setOpenRedirect(false)
    }
    const handleOnCloseSuccess = () => {
        setOpenSuccess(false)
    }
    const handleMax = () => {
        if (points) {
            setInputError(false);
            setInputErrorMessage("")

            const g = Number(points) * 20
            setPoints(Number(points))
            setGems(g)
        }
    }

    const [inputError, setInputError] = useState(true)
    const [inputErrorMessage, setInputErrorMessage] = useState("")
    const handleChange = (e: any) => {
        const p = e.target.value
        setInputError(false);
        setInputErrorMessage("")
        setPoints(p)

        if (myPoints && myPoints > points) {
            setInputError(true);
            setInputErrorMessage("Insufficient Balance")
            return;
        }

        if (myPoints && myPoints <= 0) {
            setInputError(true);
            setInputErrorMessage("Input value is less than the minimum amount required. (1-100000 points)")
            return;
        }


        if (p > points) {
            setInputError(true);
            setInputErrorMessage("Insufficient Balance")
            return;
        }

        if (p && p != "" && p <= 0) {
            setInputError(true);
            setInputErrorMessage("Input value is less than the minimum amount required. (1-100000 points)")
            return;
        }



        if (p <= points) {
            const g = p * 20
            setGems(g)
        }
    }

    const handleClose = () => {
        onClose()
    }

    const handleConfirm = async () => {
        if (!token) return;
        try {
            const res = await apiService.sendCredit({
                credits: myPoints
            }, token);
            const d = bodyDecrypt(res.data, token);
            if (d && d.success === "success") {
                console.log(d)
                const data = d.data

                if (data.m == "ok") {
                    setOpenSuccess(true)
                    setTimeout(() => {
                        setOpenSuccess(false)
                        setOpenRedirect(true)
                        setTimeout(() => {
                            setOpenRedirect(false)
                            window.parent.location.href = "https://escratch.ph" + data.ssoUrl;
                        }, 4000)
                    }, 1000)
                }
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
    }
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
            >

                <AppBar sx={{ position: 'relative', background: "#F26A21" }} >
                    <Toolbar>
                        {
                            fullScreen && (
                                <IconButton
                                    edge="start"
                                    aria-label="close"
                                    sx={{
                                        border: "none",
                                        background: "none",
                                        color: "#fff"
                                    }}
                                    onClick={handleClose}
                                >
                                    <ArrowBackIosIcon />
                                </IconButton>
                            )
                        }

                        <Typography sx={{ ml: 2, flex: 1, color: "#fff !important" }} variant="h6" component="div">
                            Convert Points
                        </Typography>

                        {
                            !fullScreen && (
                                <IconButton
                                    edge="end"
                                    aria-label="close"
                                    sx={{
                                        border: "none",
                                        background: "none",
                                        color: "#fff"
                                    }}
                                    onClick={handleClose}
                                >
                                    <CloseIcon />
                                </IconButton>
                            )
                        }
                    </Toolbar>
                </AppBar>
                <Box sx={{
                    padding: "15px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flex: "1"
                }}>
                    <div>
                        <div style={{
                            padding: "20px 0"
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "10px",
                                justifyContent: "space-between",
                                padding: "0 0 8px 0"
                            }}>
                                <Typography sx={{
                                    color: "rgba(0,0,0,0.5) !important"
                                }}>
                                    Points
                                </Typography>
                                <Typography variant="subtitle2">
                                    Available balance: {points ? points : 0}
                                </Typography>
                            </div>
                            <div>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "5px"
                                }}>
                                    <TextField sx={{
                                        "& .MuiOutlinedInput-root": {
                                            border: "none"
                                        },
                                    }}
                                        value={myPoints}
                                        onChange={handleChange}

                                        placeholder="1000" fullWidth variant="outlined" type="number" />
                                    <Button sx={{
                                        color: "#F26A21"
                                    }}
                                        onClick={handleMax}
                                    >Max</Button>
                                </div>
                                {
                                    inputError && <Typography
                                        variant="caption"
                                        sx={{
                                            display: "inline-flex !important",
                                            color: "red !important",
                                            maxWidth: "270px !important"
                                        }}
                                    >{inputErrorMessage}</Typography>
                                }

                            </div>
                        </div>
                        <Divider></Divider>

                        <div style={{
                            padding: "20px 0"
                        }}>
                            <div style={{
                                padding: "0 0 8px 0"
                            }}>
                                <Typography sx={{
                                    color: "rgba(0,0,0,0.5) !important"
                                }}>
                                    Gems
                                </Typography>

                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <TextField sx={{
                                    "& .MuiOutlinedInput-root": {
                                        border: "none"
                                    }
                                }}
                                    value={gems}
                                    placeholder="--" fullWidth variant="outlined" type="number"
                                    aria-readonly />
                            </div>
                        </div>
                    </div>

                    <Button
                        disabled={inputError === true}
                        onClick={() => setOpenConfirmation(true)}
                        variant="contained"
                        sx={{
                            background: "#F26A21",
                            color: "#fff"
                        }}

                    >Convert</Button>
                </Box>
            </Dialog>

            <Dialog
                open={openConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText
                        sx={{
                            textAlign: "center"
                        }}
                    >
                        Are you sure you want to convert points?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmation}>Cancel</Button>
                    <Button onClick={handleConfirm} sx={{
                        color: "#F26A21"
                    }}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openSuccess}
                onClose={handleOnCloseSuccess}
            >
                <DialogContent>
                    <DialogContentText
                        sx={{
                            textAlign: "center"
                        }}
                    >
                        <CheckCircleOutlineIcon sx={{ fontSize: "50px", color: "green", marginBottom: "5px" }} />
                        <Typography variant="h6">Conversion Success.</Typography>
                    </DialogContentText>
                </DialogContent>
            </Dialog>

            <Dialog
                open={openRedirect}
                onClose={handleOnCloseRedirect}
            >
                <DialogContent>
                    <DialogContentText
                        sx={{
                            textAlign: "center"
                        }}
                    >
                        <Typography variant="h6">Redirecting to E-Scratch.</Typography>
                        <CircularProgress size={50} sx={{
                            marginTop: "10px"
                        }} />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default EDialog;