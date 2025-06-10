import { BrowserCodeReader, BrowserPDF417Reader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";

export function Scanner2ndTest() {
  const videoRef = useRef(null);
  const [result, setResult] = useState(null);
  const videoInit = async () => {
    try {
      const codeReader = new BrowserPDF417Reader();
      const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();

      const selectedDeviceId = videoInputDevices[0].deviceId;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDeviceId,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setTimeout(() => {
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              setResult(result.getText());
              console.log("✅ Result:", result.getText());
            }
            console.log(err);
            if (err && !(err instanceof NotFoundException)) {
              console.warn("Scan error:", err);
            }
          }
        );
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    videoInit();
  }, []);
  return (
    <video
      style={{ width: "100%", height: "100%" }}
      playsInline
      ref={videoRef}
    />
  );
}
