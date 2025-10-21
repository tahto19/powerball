//@ts-nocheck
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    IconButton,
    Typography
} from '@mui/material';

import { WinnerDialogProps } from "./interface.ts"
import { ChangeEvent, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import RandomLetters from '@/animated/RandomLettersNew.tsx';
import TestRandom from '@/animated/TestRandom.tsx';

const WinnerDialog = ({ open, ticket, name, onClose, reDraw }: WinnerDialogProps) => {
    const [allowCLose, setAllowClose] = useState(false)
    const [showName, setShowName] = useState(false)

    const handleDone = (value: boolean) => {
        console.log("Doneeeeeeeee")

        setAllowClose(value)
    }
    const handleClose = () => {
        if (allowCLose) {
            onClose(true)
        }
    }

    const handleSecondFinish = () => {
        console.log("showwwwwwwww")
        setShowName(true)
    }

    const handleRedraw = () => {
        setShowName(false)
        setAllowClose(false)
        reDraw(true)
    }

    // useEffect(() => {
    //     setAllowClose(false)
    // }, [ticket])
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
                        paddingBottom: showName ? "10px" : "30px",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <RandomLetters winner={ticket} seconds={3} onFinish={handleSecondFinish} onDone={handleDone} />
                    </div>
                    {
                        showName ? (<Typography variant="h4" sx={{ width: '100%', textAlign: "center" }}>{name}</Typography>
                        ) : null
                    }
                    {/* <TestRandom /> */}
                    <div style={{
                        display: allowCLose ? "flex" : "none",
                        justifyContent: "center",
                        marginTop: "10px",
                        paddingTop: "20px",
                        gap: '15px',
                    }}>
                        <Button
                            onClick={handleRedraw}
                            variant="contained"
                            sx={{
                                background: "#F26A21 !important",
                                padding: "10px 40px",
                                color: "white !important",
                            }}
                        >
                            Redraw
                        </Button>

                        <Button
                            onClick={handleClose}
                            variant="contained"
                            sx={{
                                padding: "10px 40px",
                                color: "white !important",
                            }}
                        >
                            Close
                        </Button>

                    </div>
                </DialogContent>

            </Dialog>
        </>
    );
}

export default WinnerDialog;