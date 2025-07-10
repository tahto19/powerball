//@ts-nocheck

import {
  DialogProps,
  enterEntries,
  RaffleState,
} from "@/components/2ndChance_iFrame/Raffles/interface.ts";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { postRaffleEntry } from "@/redux/reducers/raffleEntry/asyncCalls";
import {
  Chip,
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
import { useState, useEffect } from "react";
import { getRaffleEntry } from "@/redux/reducers/raffleEntry/asyncCalls";

const FormControl = styled(MuiFormControl)(() => ({
  width: "100%",
}));
const MyDialog = ({
  open,
  data,
  onClose,
  onSubmit,
  // totalEntries,
  // totalUsedEntries,
  // btnLoading,
}: DialogProps) => {
  const dispatch = useAppDispatch();
  const [formData, setData] = useState<RaffleState>(data);
  const [entriesDetails, setTotalEntriesDetails] = useState<enterEntries>({
    entries: null,
    raffle_id: null,
  });
  const handleClose = () => {
    onClose(false);
  };
  const handleSubmit = () => {
    console.log(formData.raffleSchedule[0]);
    console.log(entriesDetails);
    dispatch(postRaffleEntry(entriesDetails));
  };

  const { btnLoading, loading, totalUsedEntries, totalTicket, totalEntries } =
    useAppSelector((state) => state.raffleEntry);


  useEffect(() => {
    if (open) {
      dispatch(getRaffleEntry({ type: "myEntries", alpha_code: JSON.stringify(data.alpha_code) }));
      setData(data);
      setTotalEntriesDetails((prev) => ({
        ...prev,
        raffle_id: data.raffleSchedule[0]?.id,
      }));
    }
  }, [open]);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <form>
          <DialogTitle>Participate</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
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
                    onChange={(e) => {
                      setTotalEntriesDetails((prev) => ({
                        ...prev,
                        entries: parseInt(e.target.value),
                      }));
                    }}
                    helperText={`Total Entries Remaining: ${totalEntries !== null && totalUsedEntries !== null
                      ? totalEntries - totalUsedEntries
                      : "loading" + totalUsedEntries + totalEntries
                      }`}
                  />
                </FormControl>
              </Grid2>
            </Grid2>
          </DialogContent>

          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "100%" }}
              loading={btnLoading}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default MyDialog;
