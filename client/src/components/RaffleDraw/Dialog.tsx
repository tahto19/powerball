//@ts-nocheck
import {
  MyDialogProps,
  RaffleState,
} from "@/components/GameMaintenance/interface.ts";
import React, { useState, useEffect, forwardRef } from "react";
import {
  Button,
  AppBar,
  Dialog,
  Card,
  CardContent,
  CardMedia,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CustomizedDataGrid from "../CustomizedDataGrid.tsx";
import { paginationModel, columnHeader } from "./DataGridDetails.ts";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import PrizeListDialog from "./PrizeTypeDialog.tsx";
import {
  initialRaffleData,
  PrizeInfoState,
} from "@/components/GameMaintenance/interface.ts";
import {
  TimeProps,
  initailTimeData,
  WinnerDetailState,
  initailWinnerData,
} from "./interface.ts";

import apiService from "@/services/apiService";

import { capitalizeFirstLetter } from "@/utils/util.ts";
import CountDown from "./CountDown.tsx";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { bodyDecrypt } from "@/utils/util";
import { showToaster } from "@/redux/reducers/global/globalSlice";
import WinnerDialog from "./WinnerDialog.tsx";
import { getData } from "@/redux/reducers/RaffleDraw/asyncCalls.ts";
import { getDataV2 } from "@/types/allTypes.js";
import { RootState } from "@/redux/store.ts";

const base_url = import.meta.env.VITE_API_BASE_URL;
const endpoint = base_url + "api/file/serve/image/";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

const MyDialog = ({ open, data, onClose }: MyDialogProps) => {
  const dispatch = useAppDispatch();

  const [isOpen, setOpen] = useState(open);
  const [openPTDialog, setOpenPTDialog] = useState(false);
  const [prizeData, setPrizeData] = useState<PrizeInfoState>(
    initialRaffleData.raffleSchedule[0].prizeInfo[0]
  );
  const { token } = useAppSelector((state) => state.token);
  const [allowDialog, setAllowDialog] = useState(false);
  const [datePassed, setDatePassed] = useState(false);
  const [winnerDetails, setWinnerDetails] = useState(initailWinnerData);
  const [allowDraw, setAllowDraw] = useState(true);
  const [winnerDialog, setWinnerDialog] = useState(false);
  const [winnerList, setWinnerList] = useState([]);
  const { list, getDataLoading } = useAppSelector(
    (state: RootState) => state.raffleDraw.getData
  );

  useEffect(() => { }, [getDataLoading]);
  const handlePrizeTypeChange = (value: string) => {
    const prize_data = data.raffleSchedule[0].prizeInfo.find(
      (x) => x.Prize_List.type === value
    );
    if (prize_data) {
      setPrizeData(prize_data);
    } else {
      dispatch(
        showToaster({
          message: `No prize found for the selected prize type.`,
          show: true,
          variant: "error",
          icon: null,
        })
      );
    }
    setAllowDialog(true);
    setOpenPTDialog(false);
  };

  const handlePrizeClose = () => {
    setOpenPTDialog(false);
  };

  const handleClose = () => {
    onClose(false);
  };

  const getWinnerList = async () => {
    const payload = {
      raffle_schedule_id: data.raffleSchedule[0].id,
    };
    const res = await apiService.getWinner(payload, token);
    const d = bodyDecrypt(res.data, token);

    if (d && d.success === "success") {
      setWinnerList(d.data.list);
    }
  };
  const handleDraw2 = async () => {
    try {
      setAllowDraw(false);
      const raffle_id = data.raffleSchedule[0].id;
      const prize_id = prizeData.id;

      if (!raffle_id) return;

      const payload = {
        raffle_id,
        prize_id,
      };
      const res = await apiService.ticketDraw(payload, token);

      const d = bodyDecrypt(res.data, token);
      if (d && d.success === "success") {
        setWinnerDialog(true);
        setWinnerDetails(d.data.winnerDetails);
      }

      setAllowDraw(true);
    } catch (err) {
      setAllowDraw(true);
      dispatch(
        showToaster({
          err,
          show: true,
          variant: "error",
          icon: null,
        })
      );
    }
  };
  const handleDraw = async () => {
    try {
      setAllowDraw(false);
      const raffle_id = data.raffleSchedule[0].id;
      const prize_id = prizeData.id;

      if (!raffle_id) return;

      const payload = {
        raffle_id,
        prize_id,
      };
      const res = await apiService.ticketDraw(payload, token);

      const d = bodyDecrypt(res.data, token);
      if (d && d.success === "success") {
        setWinnerDialog(true);
        setWinnerDetails(d.data.winnerDetails);
      }

      setAllowDraw(true);
    } catch (err) {
      setAllowDraw(true);
      dispatch(
        showToaster({
          err,
          show: true,
          variant: "error",
          icon: null,
        })
      );
    }
  };

  const [timeLeft, setTimeLeft] = useState<TimeProps>(initailTimeData);
  const [query, setQuery] = useState<getDataV2>({
    sort: [],
    filter: [],
    limit: 10,
    offset: 0,
  });
  useEffect(() => {
    setOpen(open);
    setPrizeData(initialRaffleData.raffleSchedule[0].prizeInfo[0]);
    setOpenPTDialog(true);
    setAllowDialog(false);
    setDatePassed(false);

    if (!open) {
      setOpenPTDialog(false);
    }

    const interval = setInterval(() => {
      const now = moment();
      const future = moment(data.raffleSchedule[0].schedule_date);

      if (now.isSameOrAfter(future)) {
        // Date has passed
        setDatePassed(true);
        clearInterval(interval); // stop the interval if needed
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const duration = moment.duration(future.diff(now));

      setTimeLeft({
        days: String(duration.days()).padStart(2, "0"),
        hours: String(duration.hours()).padStart(2, "0"),
        minutes: String(duration.minutes()).padStart(2, "0"),
        seconds: String(duration.seconds()).padStart(2, "0"),
      });
    }, 1000);
    // crisanto list of winners

    return () => clearInterval(interval);
  }, [open, data]);

  const handleWinnerDialogClose = (value) => {
    setWinnerDialog(!value);
    fetchDraw()
  };

  const fetchDraw = () => {
    const copy = { ...query };
    copy.filter = [
      {
        filter: data.raffleSchedule[0].id,
        field: "$Raffle_Prize.raffle_schedule_id$",
        type: "number",
      },
    ];

    dispatch(getData(copy));
  }
  useEffect(() => {
    if (open) {
      //   getWinnerList(); // comment by crisanto
      //   {
      //     raffle_schedule_id: data.raffleSchedule[0].id,
      //   }
      fetchDraw()
    }
  }, [open]);

  return (
    <>
      <Dialog
        fullScreen
        open={isOpen}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", boxShadow: "none" }}>
          <Toolbar
            sx={{
              backgroundColor: "hsl(220, 20%, 25%)",
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{
                border: "none",
                background: "none",
                color: "white",
              }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {data.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "hsl(220, 35%, 3%)",
              backgroundImage:
                "linear-gradient(to bottom, hsl(220, 20%, 25%), hsl(220, 30%, 6%))",
              margin: "0 auto",
              height: "350px",
              color: "white",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
                {capitalizeFirstLetter(prizeData.Prize_List.type)} Prize (PHP)
              </Typography>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                onClick={() => setOpenPTDialog(true)}
                sx={{
                  position: "absolute",
                  right: "-45px",
                  top: "-2px",
                  border: "none",
                  background: "rgba(0,0,0, 0.2)",
                  color: "white",
                  padding: "7px",
                  "&:hover": {
                    background: "rgba(0,0,0, 0.4)",
                  },
                }}
              >
                <EditIcon sx={{ fontSize: "15px" }} />
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: "48px", fontWeight: "900" }}>
              {Number(prizeData.amount) ? Number(prizeData.amount).toLocaleString() : prizeData.amount}
            </Typography>
            <CardMedia
              component="img"
              sx={{ width: "auto", height: 200 }}
              image={endpoint + data.fileInfo?.id}
              alt="Paella dish"
            />
            <Card
              sx={{
                position: "absolute",
                bottom: "-30px",
                width: "50%",
                padding: "10px 40px",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <CountDown time={timeLeft} />
                  <Button
                    onClick={handleDraw2}
                    // disabled={!datePassed || !allowDraw}
                    variant="contained"
                    sx={{
                      padding: "10px 40px",
                      color: "white !important",
                      // opacity: !datePassed ? "0.6" : "1",
                    }}
                  >
                    Draw Now
                  </Button>
                  <Button
                    onClick={handleDraw}
                    disabled={!datePassed || !allowDraw}
                    variant="contained"
                    sx={{
                      padding: "10px 40px",
                      color: "white !important",
                      opacity: !datePassed ? "0.6" : "1",
                    }}
                  >
                    Draw
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              marginTop: "60px",
              marginBottom: "30px",
            }}
          >
            <CustomizedDataGrid
              sx={{
                width: "50%",
                margin: "0 auto",
              }}
              loading={!getDataLoading}
              isAction={false}
              data={list}
              headers={columnHeader}
              pagination={paginationModel}
              checkboxSelection={false}
            />
          </Box>
        </Box>
        <PrizeListDialog
          open={openPTDialog}
          allowCloseDialog={allowDialog}
          onChange={handlePrizeTypeChange}
          onClose={handlePrizeClose}
        />
        <WinnerDialog
          open={winnerDialog}
          ticket={winnerDetails.ticket_history_generate}
          onClose={handleWinnerDialogClose}
        />
      </Dialog>
    </>
  );
};

export default MyDialog;
