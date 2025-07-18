//@ts-nocheck
import { IDetectedBarcode } from "@/types/allTypes";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState, CSSProperties } from "react";
import LoadingContent from "./LoadingContent";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useAppDispatch } from "@/redux/hook";
import { addTicket } from "@/redux/reducers/ticket/asyncCalls";
import ScannerIframe from "../2ndChance_iFrame/Scanner/Scanner";
// import { Scanner2ndTest } from "../2ndChance_iFrame/Scanner/Scanner2ndTest";

const Dialog_ = ({ open, data, dialogType, onClose }) => {
  const [scannedData, setScannedData] = useState<
    IDetectedBarcode | undefined
  >();
  let [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  let [color, setColor] = useState("#ffffff");
  const scanned = (e: IDetectedBarcode[]) => {
    setScannedData(e[0]);
    console.log(e[0]);
    // dispatch(addTicket(e[0]));
  };
  const mimicsend = () => {
    dispatch(addTicket("testing"));
  };
  const handleClose = () => {
    onClose();
  };
  const handleScanSuccess = (decodedText: string, decodedResult: any) => {
    console.log("✅ QR Code:", decodedText);
  };

  const handleScanFailure = (error: string) => {
    // Optional: console.warn('Scan error:', error);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{dialogType} Scanning</DialogTitle>
      <DialogContent>
        <ScannerIframe
          onScanSuccess={handleScanSuccess}
          onScanFailure={handleScanFailure}
        />
        {/* <Scanner2ndTest /> */}
        {/* {scannedData?.rawValue}
        {scannedData && scannedData?.rawValue ? (
          <>
            <LoadingContent />
          </>
        ) : (
          <Scanner onScan={(result: IDetectedBarcode[]) => scanned(result)} />
        )} */}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => mimicsend()}>Sending</Button>
        <Button
          color="red"
          onClick={() => handleClose()}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Dialog_;
