import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { adminType } from "@/types/allTypes";

import { useState } from "react";

import { useAppDispatch } from "@/redux/hook";
import { setUserToAdmin } from "@/redux/reducers/user/asnycCalls";
interface AdminDialogInterface {
  open: boolean;
  details: adminType;

  closeDialog: () => void;
}
export default function AdminDialogConfirmation({
  open,
  details,

  closeDialog,
}: AdminDialogInterface) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleSubmit = async () => {
    await dispatch(setUserToAdmin(details));
    closeDialog();
    setLoading(false);
  };
  return (
    <Dialog open={open}>
      <DialogTitle>Warning</DialogTitle>
      <DialogContent>
        Are you sure you want to make this user Admin{" "}
        <Typography sx={{ color: "#ff0000", display: "inline" }}>
          {details && details?.firstname} {details?.lastname}{" "}
        </Typography>
        ?
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          size="small"
          variant="outlined"
          sx={{ color: "green", borderColor: "green" }}
          onClick={handleSubmit}
          loading={loading}
        >
          Yes
        </Button>
        <Button
          color="error"
          size="small"
          variant="outlined"
          sx={{ color: "red", borderColor: "red" }}
          onClick={() => closeDialog()}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
