//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import {
  Html5QrcodeScanner,
  Html5QrcodeScannerState,
  Html5QrcodeScanType,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

interface QrScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (error: string) => void;
  test?: boolean;
}

const Scanner: React.FC<QrScannerProps> = ({ onScanSuccess, test }) => {
  const [qrCodeBox, setQrCodeBox] = useState({ width: 350, height: 350 });
  useEffect(() => {
    // Get values once on mount
    const width = window.innerWidth;

    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    setQrCodeBox(() => ({ height: height / 3.5, width: width / 1.3 }));
    console.log(height, width);
  }, []);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const defaultvideoConstraints = {
    facingMode: { exact: "environment" },
    width: { ideal: 800 },
    height: { ideal: 800 },
  };
  const defaultQrBox = { width: 350, height: 350 };

  useEffect(() => {
    if (test !== null) {
      const getVideoConstraints = test
        ? {
            width: { ideal: 1600 },
            height: { ideal: 1600 },
            facingMode: { exact: "environment" },
            advanced: [{ zoom: 2.5 }],
          }
        : defaultvideoConstraints;
      const getQrBox = test ? qrCodeBox : defaultQrBox;
      console.log(getQrBox);
      if (!scannerRef.current) {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 60,
            qrbox: getQrBox,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            formatsToSupport: [Html5QrcodeSupportedFormats.PDF_417],
            useBarCodeDetectorIfSupported: true,
            // aspectRatio: 1.7777778,
            aspectRatio: 1.333334,
            disableFlip: false,
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
            videoConstraints: getVideoConstraints,
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
  }, [test]);

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      id="qr-reader"
    />
  );
};

export default Scanner;
