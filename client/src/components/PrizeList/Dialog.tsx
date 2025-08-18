//@ts-nocheck
import * as React from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { showToaster } from "@/redux/reducers/global/globalSlice"

import { TextField, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormLabel, Grid2 } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiFormControl from '@mui/material/FormControl';

import { MyDialogProps, PrizeState } from '@/components/PrizeList/interface';

import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";

const FormControl = styled(MuiFormControl)(({ theme }) => ({
    width: "100%"
}));

const MyDialog = ({ open, data, dialogType, onClose, onSubmit }: MyDialogProps) => {
    // const [isOpen, setOpen] = React.useState(open);
    const dispatch = useAppDispatch();
    const [dialog_type, setDialogType] = React.useState("")
    const [formData, setData] = React.useState<PrizeState>(data);
    const { token } = useAppSelector((state) => state.token);
    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let message;
            let res;

            if (dialogType === 'Edit') {
                res = await apiService.updatePrizeList(formData, token);
                message = "Record updated successfully."
            } else {
                res = await apiService.createPrizeList(formData, token);
                message = "Record created successfully."
            }

            const d = bodyDecrypt(res.data, token)

            if (d && d.success === 'success') {
                setSubmitting(false);
                dispatch(showToaster({
                    message: message,
                    show: true,
                    variant: "success",
                    icon: null,
                }))
                onClose(false);
                onSubmit()
            } else {
                setSubmitting(false);
                dispatch(showToaster({
                    message: d.message,
                    show: true,
                    variant: "error",
                    icon: null,
                }))
            }
        } catch (err) {
            setSubmitting(false);
            dispatch(showToaster({ err, variant: "error", icon: "error" }));
            return false;
        }
    }



    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleClose = () => {
        onClose(false);
    };

    React.useEffect(() => {
        setData(data)
        setDialogType(dialogType)
        setSubmitting(false);
    }, [data, dialogType])


    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}

            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>{dialog_type} Prize</DialogTitle>
                    <DialogContent>
                        <Grid2
                            container
                            spacing={2}
                            columns={12}
                        >
                            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <FormControl>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <TextField
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="John"
                                        autoComplete="name"
                                        autoFocus
                                        required
                                        fullWidth
                                        value={formData.name}
                                        onChange={handleInputChange}
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
                                    <FormLabel htmlFor="type">Type</FormLabel>
                                    <TextField
                                        select
                                        id="type"
                                        type="text"
                                        name="type"
                                        autoComplete="type"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}

                                    >
                                        <MenuItem value={'grand'}>Grand</MenuItem>
                                        <MenuItem value={'major'}>Major</MenuItem>
                                        <MenuItem value={'minor'}>Minor</MenuItem>
                                    </TextField>
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="value">Value</FormLabel>
                                    <TextField
                                        id="value"
                                        type="string"
                                        name="value"
                                        placeholder="1000"
                                        autoComplete="value"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        value={formData.value}
                                        onChange={handleInputChange}
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2>
                        </Grid2>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        {
                            dialog_type === 'View' ? null : (
                                <Button type="submit" disabled={submitting}>Submit</Button>
                            )
                        }
                    </DialogActions>

                    {/* <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Submit</Button>
                    </DialogActions> */}
                </form>
            </Dialog>
        </>
    )
}

export default MyDialog;