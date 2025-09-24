import { Button, styled } from "@mui/material";
import { useState } from "react";
import Dialog_ from "./Dialog_";
import { CloudUploadOutlined } from "@mui/icons-material";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 0,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 0,
});
export default function UploadQRBtn() {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <Dialog_ open={false} />
      <Button
        component="label"
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadOutlined />}
      >
        Upload QRCODE
        <VisuallyHiddenInput
          type="file"
          onChange={(event) => console.log(event.target.files)}
          multiple
        />
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setOpenDialog(true);
        }}
      ></Button>
    </>
  );
}
