import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { adminType } from "@/types/allTypes";
import { toast } from "react-toastify";
import { useState } from "react";
import { delay, getMessage } from "@/utils/util";
import apiService from "@/services/apiService";
import { useAppDispatch } from "@/redux/hook";
import { setUserToAdmin } from "@/redux/reducers/user/asnycCalls";
interface AdminDialogInterface {
  open: boolean;
  details: adminType;
  token: string;
  closeDialog: () => void;
}
export default function AdminDialogConfirmation({
  open,
  details,
  token,
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
