//@ts-nocheck
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
import PrizeListDialog from './PrizeTypeDialog.tsx';
import {
    initialRaffleData,
    PrizeInfoState,
} from "@/components/GameMaintenance/interface.ts";
import { TimeProps, initailTimeData } from "./interface.ts";

import apiService from "@/services/apiService";

import { capitalizeFirstLetter } from '@/utils/util.ts';
import CountDown from './CountDown.tsx';
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { bodyDecrypt } from "@/utils/util";

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
    const [openPTDialog, setOpenPTDialog] = useState(false);
    const [prizeData, setPrizeData] = useState<PrizeInfoState>(initialRaffleData.raffleSchedule[0].prizeInfo[0]);
    const { token } = useAppSelector((state) => state.token);

    const handlePrizeTypeChange = (value: string) => {
        const prize_data = data.raffleSchedule[0].prizeInfo.find(x => x.Prize_List.type === value)
        console.log("Prize Data >>>>>>>>>", prize_data)
        if (prize_data) {
            setPrizeData(prize_data)
        }
        setOpenPTDialog(false)
    }

    const handleClose = () => {
        onClose(false)
    }

    const handleDraw = async () => {
        const raffle_id = data.raffleSchedule[0].raffle_id
        const prize_id = prizeData.prize_id

        if (!raffle_id) return;

        const payload = {
            raffle_id,
            prize_id
        }
        const res = await apiService.ticketDraw(payload, token);

        const d = bodyDecrypt(res.data, token);
        if (d && d.success === "success") {
            console.log(">>>>>>>>", d.data);
        }
    }

    const [timeLeft, setTimeLeft] = useState<TimeProps>(initailTimeData);

    useEffect(() => {
        console.log(data)
        setOpen(open)
        setPrizeData(initialRaffleData.raffleSchedule[0].prizeInfo[0])
        setOpenPTDialog(true)

        if (!open) {
            setOpenPTDialog(false)
        }

        const interval = setInterval(() => {
            const now = moment();
            const future = moment(data.raffleSchedule[0].schedule_date);
            const duration = moment.duration(future.diff(now));

            setTimeLeft({
                days: String(duration.days()).padStart(2, "0"),
                hours: String(duration.hours()).padStart(2, "0"),
                minutes: String(duration.minutes()).padStart(2, "0"),
                seconds: String(duration.seconds()).padStart(2, "0"),
            });
        }, 1000);

        return () => clearInterval(interval);

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
                            <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>{capitalizeFirstLetter(prizeData.Prize_List.type)} Prize (PHP)</Typography>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                onClick={() => setOpenPTDialog(true)}
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
                        <Typography sx={{ fontSize: "48px", fontWeight: "900" }}>{Number(prizeData.amount).toLocaleString()}</Typography>
                        <CardMedia
                            component="img"
                            sx={{ width: "auto", height: 200 }}
                            image={endpoint + data.fileInfo?.id}
                            alt="Paella dish"
                        />
                        <Card sx={{ position: "absolute", bottom: "-30px", width: "50%", padding: "10px 40px" }}>
                            <CardContent>
                                <Box sx={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "space-between" }}>
                                    <CountDown time={timeLeft} />
                                    <Button onClick={handleDraw} variant="contained" sx={{ padding: "10px 40px" }}>Draw</Button>
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
                <PrizeListDialog open={openPTDialog} onChange={handlePrizeTypeChange} />
            </Dialog>
        </>
    );

}

export default MyDialog;