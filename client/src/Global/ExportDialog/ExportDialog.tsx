//@ts-nocheck
import { closeDialog } from "@/redux/reducers/download/exportDataSlice";
import { RootState } from "@/redux/store";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  Popover,
  TextField,
} from "@mui/material";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { useState } from "react";
import { downloadData } from "@/redux/reducers/download/asyncCalls";
export function ExportDialog() {
  const { filter, show, loading, type, title } = useSelector(
    (state: RootState) => {
      return state.exportData;
    }
  );

  const [dateRanges, setDateRanges] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSelect = (e: any) => {
    setDateRanges(e.selection);
  };
  const handleDownload = () => {
    let dr = dateRanges.endDate
      ? [dateRanges.startDate, dateRanges.endDate]
      : null;
    dispatch(downloadData({ type, dr, filter }));
  };

  return (
    <Dialog
      open={show}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title ? title : "Export Data"}</DialogTitle>
      <DialogContent>
        <Grid2
          sx={{ marginTop: "10px" }}
          container
          spacing={2}
        >
          <Grid2 size={{ xs: 12 }}>
            <TextField
              onClick={(e: any) => {
                handleClick(e);
              }}
              value={`${
                dateRanges.endDate
                  ? `${moment(dateRanges.startDate).format(
                      "MMMM DD, YYYY"
                    )} - ${moment(dateRanges.endDate).format("MMMM DD, YYYY")}`
                  : ""
              } `}
              id={id}
              label="Date"
              fullWidth
              size="small"
            ></TextField>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <DateRangePicker
                ranges={[dateRanges]}
                onChange={handleSelect}
              />
            </Popover>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={loading}
          onClick={() => {
            handleDownload();
          }}
        >
          Download
        </Button>
        <Button
          onClick={() => {
            dispatch(closeDialog());
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
