//@ts-nocheck
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import BarcodeScanner from "react-qr-barcode-scanner";
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
import { html5QrcodeScanner } from "html5-qrcode";
const base_url = import.meta.env.VITE_API_BASE_URL;
const endpoint = base_url + "member-area/";
const ScannerIframe = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { ticketSubmit } = useAppSelector((state: RootState) => state.ticket);
  const [scanned, setScanned] = useState<string | null>();
  const { loading, token } = useAppSelector((state) => state.token);
  const handleScan = (e: string) => {
    setScanned(e);
    if (e) dispatch(addTicket(e));
  };
  const handleBackTo = () => {
    window.history.back();
    // const params = new URLSearchParams(window.location.search);
    // const from = params.get('from');
    // if (from) {
    //   window.location.href = base_url + from;
    // } else {
    //   // fallback
    //   // navigate("2nd-chance/");
    //   window.history.back();
    // }
  };
  useEffect(() => {
    if (!ticketSubmit) setScanned(null);
  }, [ticketSubmit]);
  useEffect(() => {
    if (!loading) {
      if (token === null) {
        window.parent.location.href = endpoint;
        // navigate("/member-area");
      }
    }
  }, [loading]);
  return (
    <>
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
        {scanned ? (
          <CircularProgress size="5rem" />
        ) : (
          // <Scanner
          //   onScan={(result: IDetectedBarcode[]) => handleScan(result)}
          // />
          <Box
            sx={{
              position: "relative",
              width: "500px",
              height: "400px",
            }}
          >
            <BarcodeScanner
              onUpdate={(err, result: any) => {
                if (result) handleScan(result?.text);
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "450px",
                height: "200px",
                border: "2px solid black",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            ></Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ScannerIframe;
