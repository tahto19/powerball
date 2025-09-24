import { Dialog, DialogTitle, DialogContent } from "@mui/material";

export default function Dialog_({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <DialogTitle>Uploading Of QRCode</DialogTitle>
      <DialogContent></DialogContent>
    </Dialog>
  );
}
