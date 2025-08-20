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
  Select,
  Autocomplete,
} from "@mui/material";
import MuiFormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { getRaffleEntry } from "@/redux/reducers/raffleEntry/asyncCalls";
import { showToaster } from "@/redux/reducers/global/globalSlice";

const FormControl = styled(MuiFormControl)(() => ({
  width: "100%",
}));
const MyDialog = ({
  open,
  data,
  onClose,
  onSubmit,
}: // totalEntries,
// totalUsedEntries,
// btnLoading,
DialogProps) => {
  const dispatch = useAppDispatch();
  const [formData, setData] = useState<RaffleState>(data);
  const [alphaCodeChosen, setAlphaCodeChosen] = useState([]);
  const [totalEntriesAlphaCodeSelected, setTotalEntriesAlphaCodeSelected] =
    useState(null);
  const [entriesDetails, setTotalEntriesDetails] = useState<enterEntries>({
    entries: null,
    raffle_id: null,
  });
  const handleClose = () => {
    onClose(false);
  };
  const handleSubmit = () => {
    dispatch(postRaffleEntry({ entriesDetails, alphaCodeChosen }));
  };

  const {
    btnLoading,
    loading,
    totalUsedEntries,
    totalTicket,
    totalEntries,
    details,
  } = useAppSelector((state) => state.raffleEntry);

  useEffect(() => {
    if (open) {
      dispatch(
        getRaffleEntry({
          type: "myEntries",
          alpha_code: JSON.stringify(data.alpha_code),
        })
      );
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
                  <FormLabel htmlFor="details">Tickets</FormLabel>
                  <Autocomplete
                    options={details}
                    getOptionLabel={(option) =>
                      `${option.alpha_code} entries: ${
                        option.totalEntries - option.totalUsedEntries
                      }`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        placeholder="Tickets"
                        helperText={
                          totalEntriesAlphaCodeSelected
                            ? `Total Entries Remaining selected: ${totalEntriesAlphaCodeSelected}`
                            : ""
                        }
                      />
                    )}
                    label="Tickets List"
                    multiple
                    renderValue={(value: readonly string[], getItemProps) =>
                      value.map((option: string, index: number) => {
                        const { key, ...itemProps } = getItemProps({ index });
                        return (
                          <Chip
                            variant="outlined"
                            label={option}
                            key={key}
                            {...itemProps}
                          />
                        );
                      })
                    }
                    onChange={(e, v) => {
                      setAlphaCodeChosen(v);
                      setTotalEntriesDetails((prev) => ({
                        ...prev,
                        entries: 0,
                      }));
                      if (v.length < 0) setTotalEntriesAlphaCodeSelected(null);
                      else {
                        let total = v.reduce(
                          (added, current) =>
                            added +
                            (current.totalEntries - current.totalUsedEntries),
                          0
                        );
                        setTotalEntriesAlphaCodeSelected(total);
                      }
                    }}
                  >
                    {/* {details?.map((v, i) => (
                      <MenuItem
                        key={i}
                        value={v.alpha_code}
                      >
                        {v.alpha_code} entries :
                        {v.totalEntries - v.totalUsedEntries}
                      </MenuItem>
                    ))} */}
                  </Autocomplete>
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
                    value={entriesDetails.entries}
                    onChange={(e) => {
                      let getTotal =
                        e.target.value === "" ? "" : parseInt(e.target.value);
                      if (getTotal > totalEntriesAlphaCodeSelected) {
                        dispatch(
                          showToaster({
                            err: "More than the total of the selected",
                            variant: "error",
                            icon: "error",
                          })
                        );
                        setTotalEntriesDetails((prev) => ({
                          ...prev,
                          entries: totalEntriesAlphaCodeSelected,
                        }));
                      } else {
                        setTotalEntriesDetails((prev) => ({
                          ...prev,
                          entries: getTotal,
                        }));
                      }
                    }}
                    helperText={`Total Entries Remaining: ${
                      totalEntries !== null && totalUsedEntries !== null
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
