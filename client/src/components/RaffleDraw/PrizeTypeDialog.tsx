//@ts-nocheck
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem
} from '@mui/material';

import { PrizeTypeDialogProps } from "./interface.ts"
import { ChangeEvent, useState } from 'react';

const PrizeTypeDialog = ({ open, allowCloseDialog, onChange, onClose }: PrizeTypeDialogProps) => {
    const [type, setType] = useState('')

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        setType(val)
        onChange(val)
    }


    const handleClose = () => {
        onClose(false);
    };

    return (
        <>
            <Dialog open={open} onClose={allowCloseDialog ? handleClose : undefined} >
                <DialogTitle sx={{ p: 2 }}>
                    Prize Type
                </DialogTitle>
                <DialogContent dividers sx={{ width: "300px" }}>
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
                        value={type}
                        onChange={handleInputChange}
                        sx={{ width: "100%" }}
                    >
                        <MenuItem value={'grand'}>Grand</MenuItem>
                        <MenuItem value={'major'}>Major</MenuItem>
                        <MenuItem value={'minor'}>Minor</MenuItem>
                    </TextField>
                </DialogContent>

            </Dialog>
        </>
    );
}

export default PrizeTypeDialog;