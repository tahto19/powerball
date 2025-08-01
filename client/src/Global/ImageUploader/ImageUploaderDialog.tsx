//@ts-nocheck
import { imageUpload } from "@/types/allTypes";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid2,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
const base_url = import.meta.env.VITE_API_BASE_URL;
const apiEndpoint = base_url + "api/file/serve/image/"
export default function ImageUploaderDialog({
  handleSubmitForm,
  open,
  onClose,
  loading,
  imageUploaded,
}: {
  handleSubmitForm?: (data: imageUpload) => void;
  open: boolean;
  onClose?: () => void;
  loading: boolean;
  imageUploaded: imageUpload[];
}) {
  const [data, setData] = useState(null);
  const {
    getValues,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<imageUpload>({
    mode: "onChange",
  });
  const handleClose = () => {
    if (onClose) onClose();
    reset();
    setData(null);
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    setData((prev: any) => ({
      ...prev,
      name:
        acceptedFiles.length > 0
          ? acceptedFiles[0].name.split(".")[0]
          : prev.name,
      file: acceptedFiles,
    }));
    setValue("file", acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    onDrop,
    multiple: false,
  });
  // useEffect(() => {
  //   if (open) {
  //     register("file", { required: true });
  //   }
  // }, [open]);
  useEffect(() => {
    console.log(imageUploaded);

    if (imageUploaded.length > 0) {
      setValue('name', imageUploaded[0].name)
      setValue('description', imageUploaded[0].description)
      setValue('id', imageUploaded[0].id)
      setValue('file', [])
      register("file", { required: false });
    } else {
      register("file", { required: true });
    }
  }, [imageUploaded]);
  const onSubmit = (e: imageUpload) => {
    if (handleSubmitForm) handleSubmitForm(e);
    setValue('name', "")
    setValue('description', "")
    setValue('id', 0)
    setValue('file', [])
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle>Uploading Image</DialogTitle>
      <form
        style={{ width: "100%" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogContent>
          <Grid2
            container
            spacing={2}
            columns={12}
          >
            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
              <FormControl fullWidth>
                <FormLabel htmlFor="description">Description</FormLabel>
                <TextField
                  id="description"
                  type="text"
                  placeholder=""
                  autoComplete="description"
                  autoFocus
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "auto",
                    },
                  }}
                  {...register("description", { required: true })}
                //   slotProps={{
                //     input: {
                //       readOnly: dialog_type === "View",
                //     },
                //   }}
                />
              </FormControl>
              {errors &&
                errors.description &&
                errors.description.type &&
                errors.description.type === "required" && (
                  <FormHelperText style={{ color: "red" }}>
                    Required
                  </FormHelperText>
                )}
            </Grid2>
            <FormControl fullWidth>
              <FormLabel htmlFor="name">Image Name</FormLabel>
              <TextField
                id="name"
                type="text"
                placeholder=""
                autoComplete="name"
                autoFocus
                fullWidth
                variant="outlined"
                {...register("name", { required: true })}
              />
              {errors &&
                errors.name &&
                errors.name.type &&
                errors.name.type === "required" && (
                  <FormHelperText style={{ color: "red" }}>
                    Required
                  </FormHelperText>
                )}
            </FormControl>
            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
              {imageUploaded[0] && imageUploaded[0].action_type === 'view' ?
                (
                  <img
                    src={apiEndpoint + imageUploaded[0].id}
                    alt={imageUploaded[0].name || ""}
                    loading="lazy"
                    width={'100%'}
                  />
                )
                : (

                  <Paper
                    elevation={0}
                    sx={{
                      borderStyle: "dashed",
                      borderWidth: "4px",
                      borderColor: "#cacfdb",
                      padding: "2%",
                      borderRadius: "25px",
                    }}
                  >
                    {/* {imageUploaded.length}
                {getValues && getValues("file")} */}
                    <div
                      {...getRootProps()}
                      style={
                        imageUploaded.length > 0 && !getValues("file")
                          ? {
                            backgroundImage: `url("${import.meta.env.VITE_API_BASE_URL
                              }/api/file/server/image/${imageUploaded[0].id}")`,
                          }
                          : {
                            //   backgroundImage: `url("${
                            //     import.meta.env.VITE_API_BASE_URL
                            //   }/api/file/server/image/${imageUploaded[0].id}")`,
                          }
                      }
                    >
                      {isDragActive ? (
                        <p>Drop the files here ...</p>
                      ) : (
                        <Stack
                          spacing={0}
                          sx={{ justifyContent: "center", textAlign: "center" }}
                        >
                          <Box>
                            <CloudUploadIcon sx={{ fontSize: 45 }} />
                          </Box>
                          <Box>
                            <Button
                              variant="outlined"
                              sx={{
                                borderRadius: "30px",
                                color: "black",
                                fontWeight: "bold",
                                borderColor: "#cacfdb",
                                borderWidth: "medium",
                              }}
                            >
                              {getValues("file") && getValues("file").length > 0
                                ? getValues("file")[0].name
                                : "Browse File"}
                            </Button>
                          </Box>
                          <Box>
                            <Typography>
                              {getValues("file") && getValues("file").length > 0
                                ? "Change "
                                : "Choose "}
                              a file or drag & drop it here
                            </Typography>
                            <Typography sx={{ color: "#cacfdb" }}>
                              JPEG,PNG formats, up to 50MB
                            </Typography>
                          </Box>
                        </Stack>
                      )}
                    </div>
                    <input {...getInputProps()} />
                    {
                      errors.file &&
                      errors.file.type &&
                      errors.file.type === "required" && (
                        <FormHelperText style={{ color: "red" }}>
                          Required
                        </FormHelperText>
                      )}
                  </Paper>
                )}

            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            // style={{ color: "green" }}
            sx={{ color: "green" }}
            loading={loading}
          >
            Submit
          </Button>
          <Button
            // style={{ color: "red" }}
            sx={{ color: "red" }}
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
