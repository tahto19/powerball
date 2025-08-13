//@ts-nocheck
import { useAppDispatch } from "@/redux/hook";
import { downloadData } from "@/redux/reducers/download/asyncCalls";
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
import { Dispatch, SetStateAction, useState } from "react";
import { DateRangePicker } from "react-date-range";
export default function DownloadDialog({
  open,
  setOpenDialog,
}: {
  open: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const [dateRanges, setDateRanges] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const open1 = Boolean(anchorEl);
  const handleSelect = (e: any) => {
    setDateRanges(e.selection);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnchorEl(null);
    setDateRanges({
      startDate: null,
      endDate: null,
      key: "selection",
    });
  };
  const handleDownload = (type, filter) => {
    let dr = dateRanges.endDate
      ? [dateRanges.startDate, dateRanges.endDate]
      : null;
    dispatch(downloadData({ type, dr }));
  };
  const id = open1 ? "simple-popover" : undefined;
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Download Type</DialogTitle>
      <DialogContent>
        <Grid2
          container
          spacing={1}
        >
          <Grid2 size={{ xs: 12, sm: 12, lg: 12 }}>
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
              open={open1}
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
          <Grid2 size={{ xs: 3, sm: 3, lg: 3 }}>
            <Button
              variant={!dateRanges.endDate ? "outlined" : "contained"}
              disabled={!dateRanges.endDate}
              onClick={() => {
                handleDownload(11);
              }}
            >
              1st report
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 3, sm: 3, lg: 3 }}>
            <Button
              onClick={() => {
                handleDownload(12);
              }}
              variant={!dateRanges.endDate ? "outlined" : "contained"}
              disabled={!dateRanges.endDate}
            >
              2nd report
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 3, sm: 3, lg: 3 }}>
            <Button
              onClick={() => {
                handleDownload(13);
              }}
              variant={!dateRanges.endDate ? "outlined" : "contained"}
              disabled={!dateRanges.endDate}
            >
              Combination report
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 3, sm: 3, lg: 3 }}>
            <Button
              onClick={() => {
                handleDownload(14);
              }}
              variant={!dateRanges.endDate ? "outlined" : "contained"}
              disabled={!dateRanges.endDate}
            >
              ticket scanned not used
            </Button>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ color: "red" }}
          variant="outlined"
          onClick={() => handleCloseDialog()}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
