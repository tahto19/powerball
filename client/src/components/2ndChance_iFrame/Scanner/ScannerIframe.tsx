//@ts-nocheck

import { useEffect, useState, useRef } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Button,
  Typography,
  AppBar,
  Box,
  Toolbar,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { addTicket } from "@/redux/reducers/ticket/asyncCalls";
import { RootState } from "@/redux/store";
import { getToken } from "@/redux/reducers/token/asyncCalls";
import { useNavigate } from "react-router-dom";
import Scanner from "./Scanner";
import mySound from "@/assets/alert.mp3";
// import UploadQRBtn from "../uploadQRcode/uploadQRBtn";
// import { Scanner2ndTest } from "./Scanner2ndTest";

const base_url = import.meta.env.VITE_API_BASE_URL;
const endpoint = base_url + "member-area/";
const ScannerIframe = ({ tester }: { tester?: boolean }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { ticketSubmit } = useAppSelector((state: RootState) => state.ticket);
  const [scanned, setScanned] = useState<string | null>();
  const { loading, token } = useAppSelector((state) => state.token);
  const [check, setChecker] = useState(false);

  const isSubmitting = useRef(true);
  // const isSubmitting = { current: false };
  const handleScan = (e: string) => {
    setScanned(e);

    if (e && !isSubmitting.current) {
      playSound();
      isSubmitting.current = true;
      // console.log("scann running");
      dispatch(addTicket(e));
    }
  };
  const handleBackTo = () => {
    // window.history.back();
    // const params = new URLSearchParams(window.location.search);
    // const from = params.get("from");
    // if (from) {
    //   window.location.href = base_url + from;
    // } else {
    //   // fallback
    //   // navigate("2nd-chance/");
    //   window.history.back();
    // }
    navigate("/2nd-chance");
  };

  useEffect(() => {
    if (!ticketSubmit) {
      setScanned(null);
      isSubmitting.current = false;
    }
  }, [ticketSubmit]);

  useEffect(() => {
    if (!loading) {
      if (token === null) {
        window.parent.location.href = endpoint;
        navigate("/member-area");
      }
    }
  }, [loading]);

  //html 5 qr code
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  return (
    <>
      <audio
        ref={audioRef}
        src={mySound}
        preload="auto"
      />

      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ background: "#F26A21" }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              onClick={handleBackTo}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Scanner
            </Typography>

            {/* <UploadQRBtn /> */}
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          height: "calc(100% - 64px)",
          justifyContent: "center",
          "& video": {
            objectFit: "cover",
          },
        }}
      >
        {!isSubmitting ? (
          <CircularProgress size="5rem" />
        ) : (
          <Scanner
            test={!!tester}
            onScanSuccess={(result: any) => {
              if (result) handleScan(result?.decodedText);
            }}
          />

          // <Scanner2ndTest

          // />
        )}
      </Box>
    </>
  );
};

export default ScannerIframe;
