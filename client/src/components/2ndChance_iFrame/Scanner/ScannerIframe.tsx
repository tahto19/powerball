import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import BarcodeScanner from "react-qr-barcode-scanner";
import { Card, CardContent, CardHeader, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { addTicket } from "@/redux/reducers/ticket/asyncCalls";
import { RootState } from "@/redux/store";
import { getToken } from "@/redux/reducers/token/asyncCalls";
import { useNavigate } from "react-router-dom";
const ScannerIframe = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { ticketSubmit } = useAppSelector((state: RootState) => state.ticket);
  const [scanned, setScanned] = useState<string | null>();
  const { loading, token } = useAppSelector((state) => state.token);
  const handleScan = (e: string) => {
    console.log(e);
    setScanned(e);
    if (e) dispatch(addTicket(e));
  };

  useEffect(() => {
    if (!ticketSubmit) setScanned(null);
  }, [ticketSubmit]);
  useEffect(() => {
    if (!loading) {
      console.log(token);
      if (token === null) {
        navigate("/iframe/2nd-chance/login");
      }
    }
  }, [loading]);
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Card style={{ width: "50%", height: "50%", justifyItems: "center" }}>
        <CardHeader title="Scan QR code" />
        <CardContent
          style={{
            justifyItems: "center",
            width: "60%",
            height: "60%",
            alignContent: "center",
          }}
        >
          <div>
            {scanned ? (
              <CircularProgress size="5rem" />
            ) : (
              // <Scanner
              //   onScan={(result: IDetectedBarcode[]) => handleScan(result)}
              // />
              <BarcodeScanner
                width={500}
                height={500}
                onUpdate={(err, result: any) => {
                  if (result) handleScan(result?.text);
                }}
              />
            )}
          </div>
          {/* <Button
            onClick={() => {
              handleScan([{ rawValue: "test" }]);
            }}
          >
            test
          </Button> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScannerIframe;
