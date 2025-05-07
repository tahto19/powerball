//@ts-nocheck
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    IconButton
} from '@mui/material';

import { WinnerDialogProps } from "./interface.ts"
import { ChangeEvent, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import RandomLetters from '@/animated/RandomLettersNew.tsx';
import TestRandom from '@/animated/TestRandom.tsx';

const WinnerDialog = ({ open, ticket, onClose }: WinnerDialogProps) => {
    const [allowCLose, setAllowClose] = useState(false)

    const handleDone = (value: boolean) => {
        setAllowClose(value)
    }
    const handleClose = () => {
        if (allowCLose) {
            onClose(true)
        }
    }

    return (
        <>
            <Dialog open={open} >
                {/* <DialogTitle sx={{ p: 2 }}>
                    Prize Type
                </DialogTitle> */}

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                        border: "none"
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ minWidth: "500px" }}>
                    <div style={{
                        fontSize: "50px",
                        padding: "30px",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <RandomLetters winner={ticket} seconds={3} onDone={handleDone} />
                    </div>
                    {/* <TestRandom /> */}

                </DialogContent>

            </Dialog>
        </>
    );
}

export default WinnerDialog;