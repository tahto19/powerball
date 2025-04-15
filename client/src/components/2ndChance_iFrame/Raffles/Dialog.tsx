
import { DialogProps, RaffleState } from "@/components/2ndChance_iFrame/Raffles/interface.ts"
import { Chip, TextField, Box, Switch, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormLabel, FormControlLabel, Grid2 } from '@mui/material';
import MuiFormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from "react";

const FormControl = styled(MuiFormControl)(() => ({
    width: "100%"
}));
const MyDialog = ({ open, data, onClose, onSubmit }: DialogProps) => {
    const [formData, setData] = useState<RaffleState>(data);

    const handleClose = () => {
        onClose(false);
    };

    useEffect(() => {
        setData(data)
    }, [data])
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}

            >
                <form>
                    <DialogTitle>Participate</DialogTitle>
                    <DialogContent sx={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <Grid2
                            container
                            spacing={2}
                            columns={12}
                        >
                            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <FormControl>
                                    <FormLabel htmlFor="details">Raffle</FormLabel>
                                    <TextField
                                        id="details"
                                        type="text"
                                        name="details"
                                        placeholder=""
                                        autoComplete="details"
                                        autoFocus
                                        required
                                        fullWidth
                                        value={formData.name}
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <FormControl>
                                    <FormLabel htmlFor="details">Entries</FormLabel>
                                    <TextField
                                        id="details"
                                        type="text"
                                        name="details"
                                        placeholder=""
                                        autoComplete="details"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        helperText="Total Ticket: 0"
                                    />
                                </FormControl>
                            </Grid2>
                        </Grid2>

                    </DialogContent>

                    <DialogActions>
                        <Button type="submit" variant="contained" sx={{ width: '100%' }}>Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default MyDialog;
