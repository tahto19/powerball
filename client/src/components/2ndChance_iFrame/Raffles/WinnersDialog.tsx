import { useState, useEffect } from "react";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    Grid2,
    Typography,
} from "@mui/material";

import {
    DialogProps,
    RaffleState,
} from "@/components/2ndChance_iFrame/Raffles/interface.ts";
import apiService from "@/services/apiService";
import { useAppSelector } from "@/redux/hook";
import { bodyDecrypt } from "@/utils/util";

const WinnersDialog = ({ data, open, onClose }: DialogProps) => {
    const [formData] = useState<RaffleState>(data);
    const { token } = useAppSelector((state) => state.token);

    const [winners, setWinners] = useState<any[]>([]);
    const getWinners = async () => {
        const payload = {
            id: formData.raffleSchedule[0].id,
        };
        const res = await apiService.getWinnerByRaffle(payload, token);
        const d = bodyDecrypt(res.data, token);
        if (d.length > 0) {
            setWinners(d);
        }
    };
    const handleClose = () => {
        onClose(false);
    };
    useEffect(() => {
        if (open) {
            getWinners();
        }
    }, [open]);
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    "& .MuiPaper-root": {
                        width: "30%",
                        minWidth: "400px",
                    },
                }}
            >
                <DialogTitle sx={{ border: "none" }}>Winners</DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Grid2
                        container
                        spacing={2}
                        columns={12}
                        sx={{
                            padding: "7px 15px",
                            borderTop: "1px solid hsla(220, 20%, 80%, 0.4)",
                            borderBottom: "1px solid hsla(220, 20%, 80%, 0.4)",
                        }}
                    >
                        <Grid2 size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                            <Typography># of Winners</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                            <Typography sx={{ float: "right" }}>Draw Prize</Typography>
                        </Grid2>
                    </Grid2>
                    <br />
                    <Grid2
                        container
                        spacing={2}
                        columns={12}
                        sx={{
                            padding: "7px 15px",
                        }}
                    >
                        {winners && winners.length > 0 ? (
                            winners.map((x) => (
                                <>
                                    <Grid2 size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                                        <Typography>{x.totalWinners}</Typography>
                                    </Grid2>
                                    <Grid2 size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                                        <Typography sx={{ float: "right" }}>{x.prize}</Typography>
                                    </Grid2>
                                </>
                            ))
                        ) : (
                            <Typography sx={{ width: "100%", textAlign: "center" }}>
                                No winners
                            </Typography>
                        )}
                    </Grid2>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default WinnersDialog;
