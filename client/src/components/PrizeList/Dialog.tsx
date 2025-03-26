import * as React from "react";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import MuiFormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { MyDialogProps, PrizeState } from '@/components/PrizeList/interface';
import MenuItem from '@mui/material/MenuItem';
import { showToaster } from "@/redux/reducers/global/globalSlice"
import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";

const FormControl = styled(MuiFormControl)(({ theme }) => ({
    width: "100%"
}));

const MyDialog = ({ open, data, dialogType, onClose }: MyDialogProps) => {
    // const [isOpen, setOpen] = React.useState(open);
    const [dialog_type, setDialogType] = React.useState("")
    const [formData, setData] = React.useState<PrizeState>(data);

    const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        showToaster({
            message: "Login success!",
            show: true,
            variant: "success",
            icon: null,
        })

        const res = await apiService.createPrizeList(formData);
        const d = bodyDecrypt(res.data.data)

        if (d && d.success === 'success') {
            showToaster({
                message: "Record created successfully.",
                show: true,
                variant: "success",
                icon: null,
            })
            onClose(false);
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
                        <Grid
                            container
                            spacing={2}
                            columns={12}
                        >
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
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
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
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
                                        <MenuItem value={'minor'}>Minor</MenuItem>
                                        <MenuItem value={'major'}>Major Prize</MenuItem>
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                <FormControl>
                                    <FormLabel htmlFor="value">Value</FormLabel>
                                    <TextField
                                        id="value"
                                        type="number"
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
                            </Grid>
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