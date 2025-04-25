import { MyDialogProps, RaffleState } from '@/components/GameMaintenance/interface.ts';
import React, { useState, useEffect, forwardRef } from 'react';
import {
    Button,
    AppBar,
    Dialog,
    Card,
    CardContent,
    CardMedia,
    Toolbar,
    Box,
    IconButton,
    Typography,
    Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CustomizedDataGridBasic from "../CustomizedDataGridBasic.tsx";
import { paginationModel, columnHeader } from "./DataGridDetails.ts";

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
const endpoint = "http://localhost:5128/api/file/serve/image/"

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MyDialog = ({ open, data, onClose }: MyDialogProps) => {
    const [isOpen, setOpen] = useState(open);

    const handleClose = () => {
        onClose(false)
    }

    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        console.log(data)
        setOpen(open)

        // const interval = setInterval(() => {
        //     const now = moment();
        //     const future = moment(data.raffleSchedule[0].schedule_date);
        //     const duration = moment.duration(future.diff(now));

        //     setTimeLeft({
        //       days: String(duration.days()).padStart(2, "0"),
        //       hours: String(duration.hours()).padStart(2, "0"),
        //       minutes: String(duration.minutes()).padStart(2, "0"),
        //       seconds: String(duration.seconds()).padStart(2, "0"),
        //     });
        //   }, 1000);

        //   return () => clearInterval(interval);

    }, [open, data])
    return (
        <>
            <Dialog
                fullScreen
                open={isOpen}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', boxShadow: "none" }}>
                    <Toolbar sx={{
                        backgroundColor: "hsl(220, 20%, 25%)",
                    }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{
                                border: "none",
                                background: "none",
                                color: "white",
                            }}
                            onClick={handleClose}

                        >
                            <CloseIcon />

                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            {data.name}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box>
                    <Box
                        sx={{
                            position: "relative",
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: "center",
                            backgroundColor: "hsl(220, 35%, 3%)",
                            backgroundImage: "linear-gradient(to bottom, hsl(220, 20%, 25%), hsl(220, 30%, 6%))",
                            margin: "0 auto",
                            height: "350px",
                            color: "white"
                        }}
                    >
                        <Box sx={{ position: "relative" }}>
                            <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Major Prize (PHP)</Typography>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                sx={{
                                    position: "absolute",
                                    right: "-45px",
                                    top: "-2px",
                                    border: "none",
                                    background: "rgba(0,0,0, 0.2)",
                                    color: "white",
                                    padding: "7px",
                                    '&:hover': {
                                        background: "rgba(0,0,0, 0.4)",
                                    }
                                }}

                            >
                                <EditIcon sx={{ fontSize: "15px" }} />

                            </IconButton>

                        </Box>
                        <Typography sx={{ fontSize: "48px", fontWeight: "900" }}>10,000,000</Typography>
                        <CardMedia
                            component="img"
                            sx={{ width: "auto", height: 200 }}
                            image={endpoint + data.fileInfo?.id}
                            alt="Paella dish"
                        />
                        <Card sx={{ position: "absolute", bottom: "-30px", width: "50%", padding: "10px 40px" }}>
                            <CardContent>
                                <Box sx={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "space-between" }}>
                                    <Box sx={{ display: 'flex', alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                                        <Typography sx={{ fontWeight: "500", fontSize: "20px", textWrap: "nowrap" }}>Draw closes in: </Typography>
                                        <div style={{ display: 'flex', gap: "8px" }}>
                                            <div style={{ display: 'flex', gap: "3px" }}>
                                                <Typography sx={{
                                                    borderRadius: "4px 4px 0px 0px",
                                                    padding: "0 3px",
                                                    backgroundColor: "rgb(220, 227, 231)",
                                                    fontWeight: "600"
                                                }}>13</Typography>
                                                <Typography sx={{ color: "rgb(129, 133, 140)" }}>D</Typography>
                                            </div>
                                            <div style={{ display: 'flex', gap: "3px" }}>
                                                <Typography sx={{
                                                    borderRadius: "4px 4px 0px 0px",
                                                    padding: "0 3px",
                                                    backgroundColor: "rgb(220, 227, 231)",
                                                    fontWeight: "600"
                                                }}>01</Typography>
                                                <Typography sx={{ color: "rgb(129, 133, 140)" }}>H</Typography>
                                            </div>
                                            <div style={{ display: 'flex', gap: "3px" }}>
                                                <Typography sx={{
                                                    borderRadius: "4px 4px 0px 0px",
                                                    padding: "0 3px",
                                                    backgroundColor: "rgb(220, 227, 231)",
                                                    fontWeight: "600"
                                                }}>17</Typography>
                                                <Typography sx={{ color: "rgb(129, 133, 140)" }}>M</Typography>
                                            </div>
                                            <div style={{ display: 'flex', gap: "3px" }}>
                                                <Typography sx={{
                                                    borderRadius: "4px 4px 0px 0px",
                                                    padding: "0 3px",
                                                    backgroundColor: "rgb(220, 227, 231)",
                                                    fontWeight: "600"
                                                }}>41</Typography>
                                                <Typography sx={{ color: "rgb(129, 133, 140)" }}>S</Typography>
                                            </div>
                                        </div>
                                    </Box>
                                    <Button variant="contained" sx={{ padding: "10px 40px" }}>Draw</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{
                        marginTop: "60px",
                        marginBottom: "30px",

                    }}>
                        <CustomizedDataGridBasic
                            sx={{
                                width: "50%",
                                margin: "0 auto"
                            }}
                            data={[]}
                            headers={columnHeader}
                            pagination={paginationModel}
                            checkboxSelection={false}
                        />
                    </Box>
                </Box>
            </Dialog>
        </>
    );

}

export default MyDialog;