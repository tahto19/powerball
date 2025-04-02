//@ts-nocheck
import * as React from "react";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import MuiFormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from '@mui/material/FormControlLabel';

import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { RaffleState, MyDialogProps } from '@/components/GameMaintenance/interface.ts';
import MenuItem from '@mui/material/MenuItem';
import { showToaster } from "@/redux/reducers/global/globalSlice"
import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";
import { useAppSelector } from "@/redux/hook";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import Switch from '@mui/material/Switch';
import Box from "@mui/material/Box";

const FormControl = styled(MuiFormControl)(({ theme }) => ({
    width: "100%"
}));

const MyDialog = ({ open, data, dialogType, onClose, onSubmit }: MyDialogProps) => {
    // const [isOpen, setOpen] = React.useState(open);
    const [dialog_type, setDialogType] = React.useState("")
    const [formData, setData] = React.useState<RaffleState>(data);
    const { token } = useAppSelector((state) => state.token);

    const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();

        let message;
        let res;

        console.log(formData)
        // if (dialogType === 'Edit') {
        //     res = await apiService.updatePrizeList(formData);
        //     message = "Record updated successfully."
        // } else {
        //     res = await apiService.createPrizeList(formData);
        //     message = "Record created successfully."
        // }

        // const d = bodyDecrypt(res.data, token)

        // if (d && d.success === 'success') {
        //     showToaster({
        //         message: message,
        //         show: true,
        //         variant: "success",
        //         icon: null,
        //     })
        // } else {
        //     showToaster({
        //         message: d.message,
        //         show: true,
        //         variant: "error",
        //         icon: null,
        //     })
        // }
        // onClose(false);
        // onSubmit()
    }



    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | moment.Moment, name?: string) => {


        if (moment.isMoment(event)) {
            // If the change comes from DateTimePicker
            setData((prevData) => ({
                ...prevData,
                [name]: event.toISOString(), // Store as ISO string
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

    React.useEffect(() => {
        setData(data)
        setDialogType(dialogType)
    }, [data, dialogType])


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
                                <FormControlLabel control={<Switch name="active" checked={formData.active === true} onChange={handleInputChange} />} label="Active" />
                            </FormControl>
                        </Box>
                        <Grid
                            container
                            spacing={2}
                            columns={12}
                        >
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
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
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
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
                                        onChange={handleInputChange}
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
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="value">Start Date</FormLabel>
                                    <LocalizationProvider name="starting_date" dateAdapter={AdapterMoment}>
                                        <DateTimePicker name="starting_date" onChange={(date) => handleInputChange(date, "starting_date")} // Pass name explicitly
                                            value={formData.starting_date ? moment(formData.starting_date) : moment()} />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                            {/* {
                                formData.schedule_type !== 1 ? (
                                    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                        <FormControl>
                                            <FormLabel htmlFor="value">End Date</FormLabel>
                                            <LocalizationProvider name="starting_date" dateAdapter={AdapterMoment}>
                                                <DateTimePicker name="starting_date" onChange={(date) => handleInputChange(date, "starting_date")} // Pass name explicitly
                                                    value={formData.end_date ? moment(formData.end_date) : null} />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid>
                                ) : null
                            } */}
                        </Grid>
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