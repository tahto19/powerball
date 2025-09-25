import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";
// import { useState } from "react";

export default function DialogPassword({ open }: { open: boolean }) {
  //   const [showPass, setShowPass] = useState(false);
  return (
    <Dialog open={open}>
      <DialogTitle>Changing Of Password</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            type="password"
            name="password"
            placeholder=""
            autoComplete="firstname"
            autoFocus
            required
            fullWidth
            variant="outlined"
            // value={details.password}
            // onChange={(e) => {
            //   setDetails(() => ({ ...details, ["password"]: e.target.value }));
            //   console.log(details);
            // }}
            // value={formData.firstname}
            // onChange={(event) => handleInputChange(event)}
          />

          <FormHelperText sx={{ color: "red" }}>Required</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
