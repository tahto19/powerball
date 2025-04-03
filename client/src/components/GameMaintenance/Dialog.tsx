import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { showToaster } from "@/redux/reducers/global/globalSlice"
import moment from "moment";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField, Box, Switch, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormLabel, FormControlLabel, Grid2 } from '@mui/material';
import MuiFormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

import { RaffleState, MyDialogProps } from '@/components/GameMaintenance/interface.ts';
import { PrizeListAll, initialPrizeListData } from '@/components/PrizeList/interface.ts';

import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";

const FormControl = styled(MuiFormControl)(() => ({
    width: "100%"
}));


const MyDialog = ({ open, prizeList, data, dialogType, onClose, onSubmit }: MyDialogProps) => {
    const dispatch = useAppDispatch();

    // const [isOpen, setOpen] = useState(open);
    const [dialog_type, setDialogType] = useState("")
    const [formData, setData] = useState<RaffleState>(data);
    const { token } = useAppSelector((state) => state.token);
    const [prize_List, setPrizeList] = useState<PrizeListAll>(initialPrizeListData);


    const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            let message;
            let res;

            if (dialogType === 'Edit') {
                res = await apiService.updateGM(formData, token);
                message = "Record updated successfully."
            } else {
                res = await apiService.createGM(formData, token);
                message = "Record created successfully."
            }

            const d = bodyDecrypt(res.data, token)
            console.log(">>>>>>>>>>>", d)
            if (d && d.success === 'success') {
                dispatch(showToaster({
                    message: message,
                    show: true,
                    variant: "success",
                    icon: null,
                }))
                onClose(false);
                onSubmit()
            } else {
                dispatch(showToaster({
                    message: d.message,
                    show: true,
                    variant: "error",
                    icon: null,
                }))
            }
        } catch (err) {
            dispatch(showToaster({ err, variant: "error", icon: "error" }));
            return false;
        }
    }

    const handlePrizeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const amount = prize_List.list.filter((x) => x.id === value)
        setData((prevData) => ({
            ...prevData,
            prize_id: value ?? "",
            amount: amount[0].value
        }));
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | moment.Moment, name?: string) => {


        if (moment.isMoment(event)) {
            // If the change comes from DateTimePicker
            setData((prevData) => ({
                ...prevData,
                [name as string]: event ? event.toISOString() : null, // Store as ISO string
            }));
        } else {
            // Regular input change
            const { name, value } = event.target;
            setData((prevData) => ({
                ...prevData,
                [name]: name === "active" ? !prevData.active : value,
            }));
        }
    };

    const handleClose = () => {
        onClose(false);
    };

    useEffect(() => {
        setData(data)
        setDialogType(dialogType)
        setPrizeList(prizeList)

        console.log(prizeList)
    }, [data, dialogType, prizeList])


    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}

            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>{dialog_type} Raffle Details</DialogTitle>
                    <DialogContent sx={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <Box >
                            <FormControl sx={{
                                display: "flex",
                                alignItems: "end",
                                height: "100%"
                            }}>
                                <FormControlLabel control={<Switch name="active" checked={formData.active === true} onChange={(event) => handleInputChange(event)} />} label="Active" />
                            </FormControl>
                        </Box>
                        <Grid2
                            container
                            spacing={2}
                            columns={12}
                        >
                            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <FormControl>
                                    <FormLabel htmlFor="details">Raffle ID</FormLabel>
                                    <TextField
                                        id="details"
                                        type="text"
                                        name="details"
                                        placeholder=""
                                        autoComplete="details"
                                        autoFocus
                                        required
                                        fullWidth
                                        value={formData.details}
                                        onChange={(event) => handleInputChange(event)}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="schedule_type">Schedule Type</FormLabel>
                                    <TextField
                                        select
                                        id="schedule_type"
                                        type="text"
                                        name="schedule_type"
                                        autoComplete="schedule_type"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        value={formData.schedule_type}
                                        onChange={(event) => handleInputChange(event)}
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}

                                    >
                                        <MenuItem value={'1'}>Daily</MenuItem>
                                        <MenuItem value={'2'}>Weekly</MenuItem>
                                    </TextField>
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="value">Start Date</FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DateTimePicker name="starting_date" onChange={(date: any) => handleInputChange(date, "starting_date")} // Pass name explicitly
                                            value={formData.starting_date ? moment(formData.starting_date) : moment()} />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="schedule_type">Prize Name</FormLabel>
                                    <TextField
                                        select
                                        id="prize_id"
                                        type="text"
                                        name="prize_id"
                                        autoComplete="prize_id"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        value={formData.prize_id ?? ""}
                                        onChange={handlePrizeNameChange}
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}

                                    >
                                        {
                                            prize_List?.list.length > 0 ? prize_List.list.map((x) => (

                                                <MenuItem key={x.id} value={x.id?.toString()}>{x.name}</MenuItem>

                                            )) : null
                                        }
                                    </TextField>
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="details">Amount</FormLabel>
                                    <TextField
                                        id="amount"
                                        type="number"
                                        name="amount"
                                        placeholder=""
                                        autoComplete="amount"
                                        autoFocus
                                        required
                                        fullWidth
                                        value={formData.amount}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2>
                            {/* {
                                formData.schedule_type !== 1 ? (
                                    <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                        <FormControl>
                                            <FormLabel htmlFor="value">End Date</FormLabel>
                                            <LocalizationProvider name="starting_date" dateAdapter={AdapterMoment}>
                                                <DateTimePicker name="starting_date" onChange={(date) => handleInputChange(date, "starting_date")} // Pass name explicitly
                                                    value={formData.end_date ? moment(formData.end_date) : null} />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid2>
                                ) : null
                            } */}
                        </Grid2>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default MyDialog;