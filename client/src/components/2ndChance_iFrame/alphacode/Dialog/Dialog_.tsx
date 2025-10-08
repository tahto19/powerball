import { useAppDispatch } from "@/redux/hook";
import {
  postAlphaCode,
  putAlphaCode,
} from "@/redux/reducers/alphaCode/asyncCalls";
import { alphaCodeProps } from "@/types/allTypes";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid2,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface MyDialogProps {
  open: boolean;
  data: alphaCodeProps;
  dialogType: string | null;
  onClose: (value: boolean) => void;
  loading: boolean;
}

export default function Dialog_({
  open,
  data,
  dialogType,
  onClose,
  loading,
}: MyDialogProps) {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,

    clearErrors,
    reset,
    formState: { errors },
  } = useForm<alphaCodeProps>({
    mode: "onChange",
  });
  const handleClose = () => {
    onClose(false);
    reset();
    clearErrors();
  };
  const onSubmit: SubmitHandler<alphaCodeProps> = (data: alphaCodeProps) => {
    if (dialogType === "Edit") {
      dispatch(putAlphaCode(data));
    } else {
      dispatch(postAlphaCode(data));

      reset();
    }
  };
  useEffect(() => {
    console.log(dialogType);
    if (dialogType === "Edit") {
      setValue("name", data.name);
      setValue("entries", data.entries);
      setValue("id", data.id);
    }
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{dialogType} AlphaCode</DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="my-form"
        >
          <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <FormControl>
              <FormLabel htmlFor="first name">label</FormLabel>
              <TextField
                id="label"
                type="text"
                placeholder="label"
                autoComplete="label"
                {...register("label", {
                  required: true,
                })}
                autoFocus
                required
                fullWidth
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: dialogType === "View",
                  },
                }}
              />
              {errors &&
                errors?.label &&
                errors?.label.type &&
                errors?.label.type === "required" && (
                  <FormHelperText sx={{ color: "red" }}>
                    Required
                  </FormHelperText>
                )}
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <FormControl>
              <FormLabel htmlFor="first name">Alpha Code</FormLabel>
              <TextField
                id="name"
                type="text"
                placeholder="Alpha Code"
                autoComplete="name"
                {...register("name", {
                  required: true,
                })}
                autoFocus
                required
                fullWidth
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: dialogType === "View",
                  },
                }}
              />
              {errors &&
                errors?.name &&
                errors?.name.type &&
                errors?.name.type === "required" && (
                  <FormHelperText sx={{ color: "red" }}>
                    Required
                  </FormHelperText>
                )}
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <FormControl>
              <FormLabel htmlFor="first name">Entries</FormLabel>
              <TextField
                id="entries"
                type="number"
                placeholder="Entries"
                autoComplete="entries"
                {...register("entries", {
                  required: true,
                })}
                autoFocus
                required
                fullWidth
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: dialogType === "View",
                  },
                }}
              />
              {errors &&
                errors?.entries &&
                errors?.entries.type &&
                errors?.entries.type === "required" && (
                  <FormHelperText sx={{ color: "red" }}>
                    Required
                  </FormHelperText>
                )}
            </FormControl>
          </Grid2>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          type="submit"
          form="my-form"
          loading={loading}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
