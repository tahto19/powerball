import NewDatePicker from "@/components/addUser/NewDatePicker";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid2,
  IconButton,
  TextField,
} from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers/icons";
import DatePicker from "react-datepicker";
import PopperContainer from "./PopperContainer";
import { useEffect, useState } from "react";
import moment from "moment";
import { freeTickets_ } from "@/types/allTypes";

export default function Dialog_({
  open,
  action,
  data,
  loading,
  onSubmit,
  onClose,
}: {
  open: boolean;
  action: null | string;
  data?: any;
  loading?: boolean;
  onClose?: () => void;
  onSubmit?: (e: any) => void;
}) {
  const [toSend, setToSend] = useState<freeTickets_>({
    startDate: undefined,
    endDate: undefined,
    value: null,
  });
  useEffect(() => {
    if (data)
      setToSend((prev) => {
        let value = data.value;
        let date_range = JSON.parse(data.date_range);
        console.log(date_range);
        return {
          startDate: new Date(date_range[0]),
          endDate: new Date(date_range[1]),
          value: value,
          id: data?.id,
        };
      });
  }, [action]);
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>{action} Free Tickets</DialogTitle>
      <DialogContent>
        <Grid2
          container
          spacing={1}
        >
          <Grid2 size={6}>
            <DatePicker
              className="full-width-datepicker"
              popperPlacement="bottom-start"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
              showMonthDropdown
              showYearDropdown
              selected={toSend.startDate}
              dateFormat="MMMM d, yyyy HH:mm"
              popperContainer={(props) => (
                <PopperContainer>{props.children}</PopperContainer>
              )}
              onChange={(date) => {
                console.log(date);
                if (date) setToSend((prev) => ({ ...prev, startDate: date }));
              }}
              // Optional: offset popper from input a bit

              customInput={
                <FormControl fullWidth>
                  <FormLabel htmlFor="name">Start</FormLabel>
                  <TextField
                    size="medium"
                    sx={{ width: "100%" }}
                    value={
                      !toSend.startDate
                        ? ""
                        : moment(toSend.startDate).format("MMMM DD yyyy HH:mm")
                    }
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton
                            size="small"
                            sx={{ border: "none", background: "transparent" }}
                          >
                            <CalendarIcon />
                          </IconButton>
                        ),
                      },
                    }}
                  />
                </FormControl>
              }
              //   selectDate={
              //     getValues("birthdate") === ""
              //       ? moment(getValues("birthdate")).format("MMMM DD YYYY")
              //       : moment().format("MMMM DD YYYY")
              //   }
              //   onChangeDate={(e: Date | null) => {
              //     setValue("birthdate", moment(e).toISOString(), {
              //       shouldValidate: true,
              //       shouldDirty: true,
              //     });
              //   }}
            />
          </Grid2>
          <Grid2 size={6}>
            <DatePicker
              className="full-width-datepicker"
              popperPlacement="bottom-start"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
              showMonthDropdown
              showYearDropdown
              selected={toSend.endDate}
              minDate={!toSend.startDate ? undefined : toSend.startDate}
              dateFormat="MMMM d, yyyy HH:mm"
              popperContainer={(props) => (
                <PopperContainer>{props.children}</PopperContainer>
              )}
              onChange={(date) => {
                if (date) setToSend((prev) => ({ ...prev, endDate: date }));
              }}
              // Optional: offset popper from input a bit

              customInput={
                <FormControl fullWidth>
                  <FormLabel htmlFor="name">End Date</FormLabel>
                  <TextField
                    size="medium"
                    sx={{ width: "100%" }}
                    value={
                      !toSend.endDate
                        ? ""
                        : moment(toSend.endDate).format("MMMM DD yyyy HH:mm")
                    }
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton
                            size="small"
                            sx={{ border: "none", background: "transparent" }}
                          >
                            <CalendarIcon />
                          </IconButton>
                        ),
                      },
                    }}
                  />
                </FormControl>
              }
            />
          </Grid2>
          <Grid2 size={12}>
            <FormControl fullWidth>
              <FormLabel htmlFor="name">Value</FormLabel>
              <TextField
                value={toSend.value}
                fullWidth
                variant="outlined"
                onChange={(e) => {
                  let a = parseInt(e.target.value);
                  setToSend((prev) => ({ ...prev, value: a }));
                }}
              ></TextField>
            </FormControl>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        {action?.toLowerCase() !== "view" && (
          <Button
            sx={{ color: "green" }}
            variant="text"
            onClick={() => {
              if (onSubmit) onSubmit(toSend);
            }}
          >
            Submit
          </Button>
        )}

        <Button
          sx={{ color: "red" }}
          variant="text"
          onClick={() => {
            if (onClose) onClose();
            setToSend({
              startDate: undefined,
              endDate: undefined,
              value: null,
            });
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
