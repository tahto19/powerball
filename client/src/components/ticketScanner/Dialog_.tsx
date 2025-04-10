//@ts-nocheck
import { IDetectedBarcode } from "@/types/allTypes";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState, CSSProperties } from "react";
import LoadingContent from "./loadingContent";
import { Button } from "@mui/material";

const Dialog_ = () => {
  const [scannedData, setScannedData] = useState<
    IDetectedBarcode | undefined
  >();
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  const scanned = (e: IDetectedBarcode[]) => {
    console.log(e[0]);
    setScannedData(e[0]);
  };
  return (
    <>
      <Button onClick={() => setScannedData({})}> back</Button>
      {scannedData?.rawValue}
      {scannedData && scannedData?.rawValue ? (
        <>
          <LoadingContent />
        </>
      ) : (
        <Scanner onScan={(result: IDetectedBarcode[]) => scanned(result)} />
      )}
    </>
  );
};

export default Dialog_;
