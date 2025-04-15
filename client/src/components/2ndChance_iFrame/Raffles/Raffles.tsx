import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";

import { Card, CardContent, CardMedia, CardActions, Typography, Button, Box } from '@mui/material';
import moment from "moment";
import MyDialog from "./Dialog";

import { initialRaffleData, RaffleState } from "@/components/2ndChance_iFrame/Raffles/interface.ts"

const Raffles = () => {
    const [list, setRaffleList] = useState<[]>([]);
    const [data, setData] = useState(initialRaffleData);
    const { token } = useAppSelector((state) => state.token);

    const getRafflesList = async () => {

        if (!token) return;

        const payload = {
            sort: JSON.stringify([["id", "ASC"]]),
            filter: JSON.stringify([{ field: "active", filter: 1, type: 'boolean' }])
        }
        const res = await apiService.get2ndChanceGMListAll(payload, token);

        const d = bodyDecrypt(res.data, token)
        if (d && d.success === 'success') {
            console.log(">>>>>>>>", d.data)
            setRaffleList(d.data.list)
        }
    }

    const handleParticipate = (data: RaffleState) => {
        setData(data)
        setOpen(true)
    }

    const [open, setOpen] = useState(false);
    const handleOnClose = (value: boolean) => {
        setOpen(value)
    }

    useEffect(() => {
        getRafflesList()
    }, [token])
    return (
        <>
            <div style={{
                display: "flex",
                gap: '20px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {list && list.map((x, i) => (
                    <Card key={i}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 300 }}
                                image="https://picsum.photos/400/300"
                                alt="Paella dish"
                            />
                            <CardContent>
                                <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {x.name}
                                    </Typography>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Entries: 0</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Your Entries: 0</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Draw on {moment(x.raffleSchedule[0].schedule_date).format('MMMM D, YYYY h:mm A')}</Typography>
                                </div>


                            </CardContent>
                        </Box>
                        <CardActions>
                            <Button onClick={() => handleParticipate(x)} variant="contained" sx={{ width: '100%' }}>Paticipate</Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
            <MyDialog open={open} data={data} onClose={handleOnClose} />
        </>
    );
};

export default Raffles;
