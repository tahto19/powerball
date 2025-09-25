//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
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
function waitForButton() {
  const otherBtn = document.querySelector("#qr-reader__dashboard_section_csr");
  const upload = document.querySelector(
    "#html5-qrcode-anchor-scan-type-change"
  );

  const btn = document.querySelector(
    "#qr-reader__dashboard_section_csr button"
  );
  const span = document.querySelector("#qr-reader__dashboard_section_csr span");
  if (btn) {
    btn.click();
    let getSelectCamera = document.querySelector("#html5-qrcode-select-camera");
    let getParentSelectCamera = getSelectCamera.parentElement;
    // getParentSelectCamera.style.display = "none";
  } else {
    setTimeout(waitForButton, 100); // retry after 100ms
  }
}
const Scanner: React.FC<QrScannerProps> = ({ onScanSuccess, test }) => {
  const [qrCodeBox, setQrCodeBox] = useState({ width: 350, height: 350 });

  const [videoSize, setVideoSize] = useState(null);
  const [getSize, setGetSize] = useState(false);
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
    setVideoSize(() => ({
      width: { ideal: 1600 },
      height: { ideal: 1600 },
    }));
    setGetSize(true);
  }, []);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const defaultvideoConstraints = {
    facingMode: { exact: "environment" },
    width: { ideal: 800 },
    height: { ideal: 800 },
  };
  const defaultQrBox = { width: 350, height: 350 };

  useEffect(() => {
    if (test !== null && getSize) {
      const getVideoConstraints = test
        ? {
            ...videoSize,
            // facingMode: { exact: "environment" },
            advanced: [{ zoom: 1.9 }, { focusMode: "continuous" }],
          }
        : defaultvideoConstraints;
      const getQrBox = test ? qrCodeBox : defaultQrBox;

      if (!scannerRef.current) {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 15,
            qrbox: getQrBox,
            focusMode: "continuous",
            willReadFrequently: true,
            supportedScanTypes: [
              Html5QrcodeScanType.SCAN_TYPE_CAMERA,
              Html5QrcodeScanType.SCAN_TYPE_FILE,
            ],
            formatsToSupport: [Html5QrcodeSupportedFormats.PDF_417],
            useBarCodeDetectorIfSupported: true,
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true,
            },
            // aspectRatio: 1.7777778,
            aspectRatio: 1.333334,
            disableFlip: false,
            rememberLastUsedCamera: true,
            videoConstraints: getVideoConstraints,
            // experimentalFeatures: {
            //   useBarCodeDetectorIfSupported: true, // uses native barcode scanning if available
            // },
          },
          true
        );
        console.log(scanner);
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
  }, [getSize]);
  // this part is for checking if the camera have permissions API
  const [granted, setGranted] = useState(false);
  useEffect(() => {
    navigator.permissions.query({ name: "camera" }).then((status) => {
      if (status.state === "granted") {
        setGranted(true);
      } else {
        document.querySelector(
          "#html5-qrcode-button-camera-permission"
        ).innerText = "Scan barcode";
      }
      let upload = document.querySelector(
        "#html5-qrcode-anchor-scan-type-change"
      );
      upload.style.display = "block";
      upload.innerText = "Upload an Image file";
    });
  }, []);
  useEffect(() => {
    if (granted) waitForButton();
  }, [granted]);

  return (
    <>
      <div
        style={{ width: "100%", height: "100%" }}
        id="qr-reader"
      ></div>
    </>
  );
};

export default Scanner;
