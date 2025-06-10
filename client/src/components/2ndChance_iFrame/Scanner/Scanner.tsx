//@ts-nocheck
import React, { useEffect, useRef } from "react";
import {
  Html5QrcodeScanner,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

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
          qrbox: { width: 300, height: 150 },
          formatsToSupport: [Html5QrcodeSupportedFormats.PDF_417],
          // useBarCodeDetectorIfSupported: true,
          aspectRatio: 16 / 9,
          // rememberLastUsedCamera: true,
          // experimentalFeatures: {
          //   useBarCodeDetectorIfSupported: true, // uses native barcode scanning if available
          // },
        },
        true
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
      style={{ width: "500px", height: "300px" }}
      id="qr-reader"
    />
  );
};

export default Scanner;
