import {
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import React from "react";

export default function Dialog_({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <DialogTitle>Uploading Of QRCode</DialogTitle>
      <DialogContent></DialogContent>
    </Dialog>
  );
}
