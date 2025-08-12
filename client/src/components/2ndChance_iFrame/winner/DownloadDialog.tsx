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
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
export default function DownloadDialog({ open }: { open: boolean }) {
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
  const handleDownload = (type, filter) => {
    let dr = dateRanges.endDate
      ? [dateRanges.startDate, dateRanges.endDate]
      : null;
    dispatch(downloadData({ type, dr }));
  };
  const id = open1 ? "simple-popover" : undefined;
  return (
    <Dialog open={open}>
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
          <Grid2 size={{ xs: 4, sm: 4, lg: 4 }}>
            <Button
              variant={!dateRanges.endDate ? "outlined" : "contained"}
              disabled={!dateRanges.endDate}
              onClick={() => {
                handleDownload(11);
              }}
            >
              1
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 4, sm: 4, lg: 4 }}>
            <Button
              variant={!dateRanges.endDate ? "outlined" : "contained"}
              disabled={!dateRanges.endDate}
            >
              2
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 4, sm: 4, lg: 4 }}>
            <Button
              variant={!dateRanges.endDate ? "outlined" : "contained"}
              disabled={!dateRanges.endDate}
            >
              3
            </Button>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ color: "red" }}
          variant="outlined"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
