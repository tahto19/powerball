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
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery, useTheme } from "@mui/material";

import MuiFormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { getRaffleEntry } from "@/redux/reducers/raffleEntry/asyncCalls";
import { showToaster } from "@/redux/reducers/global/globalSlice";
import apiService from "@/services/apiService";

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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useAppDispatch();
  const [formData, setData] = useState<RaffleState>(data);
  const [alphaCodeChosen, setAlphaCodeChosen] = useState([]);
  const [totalEntriesAlphaCodeSelected, setTotalEntriesAlphaCodeSelected] =
    useState(null);
  const [entriesDetails, setTotalEntriesDetails] = useState<enterEntries>({
    entries: null,
    raffle_id: null,
  });
  const [alphaCodeDetails, setAlphaCodeDetails] = useState();
  const handleClose = () => {
    onClose(false);
    setAlphaCodeChosen([]);
  };
  const handleSubmit = () => {
    dispatch(postRaffleEntry({ entriesDetails, alphaCodeChosen }));
  };
  const { token } = useAppSelector((state) => state.token);
  const {
    btnLoading,
    loading,
    totalUsedEntries,
    totalTicket,
    totalEntries,
    details,
  } = useAppSelector((state) => state.raffleEntry);
  const findAlphaCodeLabel = (ac) => {
    let find;

    if (alphaCodeDetails && alphaCodeDetails.length > 0) {
      find = alphaCodeDetails.find((v: any) => v.name === ac);
    }
    return find ? find?.label || ac : ac;
  };
  const getAplhaCode = async () => {
    try {
      if (!token) return;
      const res = await apiService.getAllAlphaCode(token);
      setAlphaCodeDetails([...res.data]);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (open) {
      // if (alphaCodeDetails && alphaCodeDetails.length < 0) {
      //   getAplhaCode();
      // }
      getAplhaCode();
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
  useEffect(() => { }, []);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isSmallScreen ? true : false}
      >
        <form
          style={{
            width: isSmallScreen ? "100%" : "600px",
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              gap: "20px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Participate
            <IconButton
              onClick={handleClose}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "14px",
                lineHeight: "21px",
                marginBottom: "30px",
                whiteSpace: "pre-line",
              }}
            >
              {formData.full_details}
            </Typography>
            <Grid2
              container
              spacing={2}
              columns={12}
            >
              <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <FormControl>
                  <FormLabel htmlFor="details">Tickets</FormLabel>
                  <Autocomplete
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "auto",
                      },
                    }}

                    noOptionsText={"No Tickets"}
                    options={details ? details : []}
                    getOptionLabel={(option) =>
                      `${findAlphaCodeLabel(option.alpha_code)} entries: ${option.totalEntries - option.totalUsedEntries
                      }`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Tickets"
                        helperText={
                          totalEntriesAlphaCodeSelected
                            ? `Total Entries Remaining selected: ${totalEntriesAlphaCodeSelected}`
                            : ""
                        }

                        inputProps={{
                          ...params.inputProps,
                          readOnly: true,
                        }}
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
                      const changeData = v.map((vv) => ({
                        ...vv,
                        entriesInput: 0,
                      }));
                      setAlphaCodeChosen(changeData);
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
              {alphaCodeChosen &&
                alphaCodeChosen.length > 0 &&
                alphaCodeChosen.map((v, i) => {
                  return (
                    <Grid2
                      size={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                      key={i}
                    >
                      <FormLabel htmlFor="details">
                        {v.alpha_code} - {v.totalEntries - v.totalUsedEntries}
                      </FormLabel>

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
                        value={v.entriesInput}
                        onChange={(e) => {
                          let getTotal =
                            e.target.value === ""
                              ? ""
                              : parseInt(e.target.value);
                          if (getTotal > v.totalEntries - v.totalUsedEntries) {
                            dispatch(
                              showToaster({
                                err: "More than the total of the selected",
                                variant: "error",
                                icon: "error",
                              })
                            );
                          } else {
                            //
                            setAlphaCodeChosen((prev) => {
                              let toChange = prev;
                              toChange[i].entriesInput = getTotal;
                              return toChange;
                            });
                            let getExactTotal = alphaCodeChosen.reduce(
                              (c, v) => c + v.entriesInput,
                              0
                            );
                            setTotalEntriesDetails((prev) => ({
                              ...prev,
                              entries: getExactTotal,
                            }));
                          }
                        }}
                        helperText={`Total Entries Remaining: ${totalEntries !== null && totalUsedEntries !== null
                          ? totalEntries - totalUsedEntries
                          : "loading" + totalUsedEntries + totalEntries
                          }`}
                      />
                    </Grid2>
                  );
                })}
              <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <FormControl>
                  <FormLabel htmlFor="details">Total Entries</FormLabel>
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
                    disabled
                    sx={{
                      color: "black !important",
                      "& .MuiInputBase-root": { height: "54.73px !important" },
                    }}
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
