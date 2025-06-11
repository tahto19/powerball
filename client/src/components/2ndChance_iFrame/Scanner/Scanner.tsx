//@ts-nocheck
import React, { useEffect, useRef } from "react";
import {
  Html5QrcodeScanner,
  Html5QrcodeScannerState,
  Html5QrcodeScanType,
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
          fps: 60,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          formatsToSupport: [Html5QrcodeSupportedFormats.PDF_417],
          // useBarCodeDetectorIfSupported: true,
          aspectRatio: 1.7777778,
          disableFlip: false,
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          useBarCodeDetectorIfSupported: true,
          videoConstraints: {
            facingMode: { exact: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
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
          console.log(error);
          // Optional failure callback
        }
      );

      setTimeout(() => {
        if (!scannerRef.current) {
          scannerRef.current = scanner;
          setTimeout(() => {
            // 👇 Access the internal Html5Qrcode instance
            const html5QrCode = scanner.html5QrCode;

            if (html5QrCode?.getRunningTrack) {
              const track = html5QrCode.getRunningTrack();
              const settings = track.getSettings();

              alert("Camera resolution:");
              alert("Width:", settings.width);
              alert("Height:", settings.height);
            } else {
              alert("Could not access internal camera track.");
            }
          }, 5000);
        }
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
