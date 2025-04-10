//@ts-nocheck
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

import { PrizeListDialogProps } from '@/components/GameMaintenance/interface.ts';
import CustomizedDataGridBasic from "../CustomizedDataGridBasic";
import { columnHeader, paginationModel } from "./DataGridDetails.ts";

const PrizeListDialog = ({ open, prizeList, selectedPrize, onClose, onSubmit }: PrizeListDialogProps) => {
    const [selectedPrizes, setSelectedPrizes] = useState<number[]>([0]);

    const handleClose = () => {
        if (selectedPrize && selectedPrize.length > 0) {
            const newselectedPrize = selectedPrize.map((x: any) => x.id)
            setSelectedPrizes(newselectedPrize)
        }
        onClose(false);
    };
    const handleSubmit = () => {
        onSubmit(selectedPrizes);
        onClose(false);
    };

    const handleRowSelection = (array: []) => {
        setSelectedPrizes(array)
    }

    useEffect(() => {
        if (selectedPrize && selectedPrize.length > 0) {
            const newselectedPrize = selectedPrize.map((x: any) => x.id)
            setSelectedPrizes(newselectedPrize)
        }
    }, [selectedPrize])

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    width: "100%",
                }}
            >

                <DialogTitle>Prize List</DialogTitle>
                <DialogContent sx={{
                    display: "flex",
                    flexDirection: "column"
                }}>

                    <CustomizedDataGridBasic
                        sx={{
                            width: "100%",
                        }}
                        data={prizeList.list}
                        headers={columnHeader}
                        pagination={paginationModel}
                        selectedModel={selectedPrizes}
                        checkboxSelection={true}
                        onRowSelection={handleRowSelection}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PrizeListDialog;