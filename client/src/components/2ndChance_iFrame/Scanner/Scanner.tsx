//@ts-nocheck
import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScannerState } from "html5-qrcode";

interface QrScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (error: string) => void;
}

const Scanner: React.FC<QrScannerProps> = ({ onScanSuccess }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 500, height: 250 },
        },
        false
      );

      scanner.render(
        (decodedText, decodedResult) => {
          onScanSuccess(decodedResult);
        },
        (error) => {
          // Optional failure callback
        }
      );

      setTimeout(() => {
        console.log(scannerRef.current);
        if (!scannerRef.current) scannerRef.current = scanner;
      }, 500);
    }

    return () => {
      scannerRef.current
        ?.clear()
        .then(() => {
          scannerRef.current = null;
        })
        .catch((err) => {
          console.error("Clear error:", err);
        });
    };
  }, []);

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      id="qr-reader"
    />
  );
};

export default Scanner;
