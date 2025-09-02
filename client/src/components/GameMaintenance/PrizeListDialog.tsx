//@ts-nocheck
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { showToaster } from "@/redux/reducers/global/globalSlice";
import moment from "moment";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  TextField,
  Box,
  Switch,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormLabel,
  FormControlLabel,
  Grid2,
} from "@mui/material";
import MuiFormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";

import {
  RaffleState,
  MyDialogProps,
} from "@/components/GameMaintenance/interface.ts";
import {
  PrizeListAll,
  initialPrizeListData,
} from "@/components/PrizeList/interface.ts";

import { PrizeListDialogProps } from "@/components/GameMaintenance/interface.ts";
import CustomizedDataGridBasic from "../CustomizedDataGridBasic";
// import { columnHeader, paginationModel } from "./DataGridDetails.ts";
import { paginationModel } from "./DataGridDetails.ts";

import { GridColDef } from "@mui/x-data-grid";



const PrizeListDialog = ({
  open,
  prizeList,
  selectedPrize,
  onClose,
  onSubmit,
}: PrizeListDialogProps) => {
  const [selectedPrizes, setSelectedPrizes] = useState<number[]>([0]);
  const dispatch = useAppDispatch();
  const [newPrizeList, setNewPrizeList] = useState<any>({ list: [] });
  const handleClose = () => {
    if (selectedPrize && selectedPrize.length > 0) {
      const newselectedPrize = selectedPrize.map((x: any) => x.id);
      setSelectedPrizes(newselectedPrize);
    }
    onClose(false);
  };
  const handleSubmit = () => {
    onSubmit(selectedPrizes);
    onClose(false);
  };

  const handleRowSelection = (array: []) => {
    if (typeof array === "string") {
      dispatch(
        showToaster({
          message: "Cannot add price with the same Type",
          show: true,
          variant: "error",
          icon: null,
        })
      );
    } else {
      setSelectedPrizes(array);
    }
  };

  useEffect(() => {
    if (selectedPrize && selectedPrize.length > 0) {
      const newselectedPrize = selectedPrize.map((x: any) => x.id);

      setSelectedPrizes(newselectedPrize);

      const newList = prizeList.list.map((o) => {
        const matchedPrizeInfo = selectedPrize.find(
          (z) => Number(z.id) === Number(o.id)
        );
        if (matchedPrizeInfo) {
          return {
            ...o,
            number_of_winners: Number(matchedPrizeInfo.number_of_winners),
          };
        }
        return o;
      })

      setNewPrizeList({ ...prizeList, list: newList })
    }
  }, [selectedPrize]);

  useEffect(() => {
    setNewPrizeList(prizeList)
  }, [prizeList]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const n = newPrizeList.list.map(x => {
      if (x.id == id) {
        x.number_of_winners = value
      }
      return x
    })

    setNewPrizeList((prev) => ({
      ...prev,
      list: n
    }))
  };

  const columnHeader: GridColDef[] = [
    { field: 'name', headerName: 'Prize Name', flex: 1, },
    { field: 'type', headerName: 'Type', flex: 1, },
    { field: 'value', headerName: 'Amount', flex: 1, },
    {
      field: 'number_of_winners',
      headerName: '# of Winners',
      flex: 1,
      renderCell: (params: any) => {
        const rowId = params.id; // Get the row ID or unique identifier
        let value = params.value;

        return (
          <div style={{
            display: "flex",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <TextField
              id={rowId}
              type="number"
              placeholder=""
              fullWidth
              value={value}  // Optional: Bind to the current value of the cell
              onChange={(event) => handleChange(event)} // Update state on change
              variant="outlined"
            />
          </div>
        );
      },
    },
  ]
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
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CustomizedDataGridBasic
            sx={{
              width: "100%",
            }}
            data={newPrizeList.list}
            headers={columnHeader}
            pagination={paginationModel}
            selectedModel={selectedPrizes}
            checkboxSelection={true}
            restrictDuplicate={"type"}
            onRowSelection={handleRowSelection}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            onClick={handleSubmit}
          >
            Add Prize
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PrizeListDialog;
