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
    onClose: (value: boolean) => void;
}

const FormControl = styled(MuiFormControl)(({ theme }) => ({
    width: "100%"
}));

const MyDialog = ({ open, onClose }: MyDialogProps) => {
    // const [isOpen, setOpen] = React.useState(open);

    const handleClose = () => {
        onClose(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Add Administrator</DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        spacing={2}
                        columns={12}
                    >
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                            <FormControl>
                                <FormLabel htmlFor="email">First Name</FormLabel>
                                <TextField
                                    id="firstName"
                                    type="text"
                                    name="first_name"
                                    placeholder="John"
                                    autoComplete="firstName"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                            <FormControl>
                                <FormLabel htmlFor="email">Last Name</FormLabel>
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
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                            <FormControl>
                                <FormLabel htmlFor="email">Mobile Number</FormLabel>
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
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                            <FormControl>
                                <FormLabel htmlFor="email">Password</FormLabel>
                                <TextField
                                    name="password"
                                    placeholder="••••••"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
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