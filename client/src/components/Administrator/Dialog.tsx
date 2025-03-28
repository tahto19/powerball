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
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';

interface MyDialogProps {
    open: boolean;
    data: DataProps;
    dialogType: string;
    onClose: (value: boolean) => void;
}

interface DataProps {
    id: number | null,
    first_name: string,
    last_name: string,
    mobile_number: string,
    email: string,
    status: string,
    password: string | null,
}

const FormControl = styled(MuiFormControl)(({ theme }) => ({
    width: "100%"
}));

const MyDialog = ({ open, data, dialogType, onClose }: MyDialogProps) => {
    // const [isOpen, setOpen] = React.useState(open);
    const [dialog_type, setDialogType] = React.useState("")
    const [formData, setData] = React.useState<DataProps>(data);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
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
                <DialogTitle>{dialog_type} Administrator</DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        spacing={2}
                        columns={12}
                    >
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                            <FormControl>
                                <FormLabel htmlFor="first name">First Name</FormLabel>
                                <TextField
                                    id="firstName"
                                    type="text"
                                    name="first_name"
                                    placeholder="John"
                                    autoComplete="firstName"
                                    autoFocus
                                    required
                                    fullWidth
                                    value={formData.first_name}
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
                                <FormLabel htmlFor="last name">Last Name</FormLabel>
                                <TextField
                                    id="lastName"
                                    type="text"
                                    name="last_name"
                                    placeholder="Snow"
                                    autoComplete="last_name"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
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
                                <FormLabel htmlFor="mobile number">Mobile Number</FormLabel>
                                <TextField
                                    id="mobileNumber"
                                    type="text"
                                    name="mobile_number"
                                    placeholder="09123456789"
                                    autoComplete="mobile_number"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    value={formData.mobile_number}
                                    onChange={handleInputChange}
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
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    slotProps={{
                                        input: {
                                            readOnly: dialog_type === 'View',
                                        },
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                            <FormControl>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <TextField
                                    name="password"
                                    placeholder="••••••"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    autoFocus
                                    fullWidth
                                    variant="outlined"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={formData.id || dialog_type === 'View' ? true : false}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default MyDialog;