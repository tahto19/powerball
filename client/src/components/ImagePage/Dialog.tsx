
import { initialImageData2, DialogProps, ImageState2 } from "./interface.ts"
import { Typography, Box, Stack, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormLabel, Grid2 } from '@mui/material';
import MuiFormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { bodyDecrypt } from "@/utils/util";
import { showToaster } from "@/redux/reducers/global/globalSlice"
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import apiService from "@/services/apiService";

const FormControl = styled(MuiFormControl)(() => ({
    width: "100%"
}));


const MyDialog = ({ open, data, dialogType, onClose, onSubmit }: DialogProps) => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.token);

    const [formData, setData] = useState<ImageState2>(initialImageData2);
    const [dialog_type, setDialogType] = useState("")
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (event: React.FocusEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.file || formData.file.length === 0 && dialogType !== 'Edit') {
            dispatch(showToaster({
                message: "Image not found",
                show: true,
                variant: "error",
                icon: null,
            }))
            return;
        }


        if (!formData.name || formData.name.trim() === "") {
            dispatch(showToaster({
                message: "Name field is empty.",
                show: true,
                variant: "error",
                icon: null,
            }))
            return;
        }

        let message;
        let res;
        const fd = new FormData();

        fd.append("id", formData.status.toString())
        fd.append("file_location", formData.file_location.toString())
        fd.append("status", formData.status.toString())
        fd.append("file", formData.file[0])
        fd.append("description", formData.description)
        fd.append("name", formData.name)
        setLoading(true)
        if (dialogType === 'Edit') {
            res = await apiService.updateImage(formData, token);
            message = "Record updated successfully."
        } else {

            res = await apiService.createImage(formData, token);
            message = "Record created successfully."
        }

        const d = bodyDecrypt(res.data, token)
        setLoading(false)

        if (d && d.success === 'success') {
            dispatch(showToaster({
                message: message,
                show: true,
                variant: "success",
                icon: null,
            }))
            onClose(false);
            onSubmit()

        } else {
            dispatch(showToaster({
                message: d.message,
                show: true,
                variant: "error",
                icon: null,
            }))
        }
        // onClose(false);
    };


    const handleClose = () => {
        onClose(false);
    };

    useEffect(() => {
        setData({ ...data, file: [] })
        setDialogType(dialogType)
    }, [data, dialogType])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        setData((prev) => ({
            ...prev,
            name: acceptedFiles.length > 0 ? acceptedFiles[0].name.split(".")[0] : prev.name,
            file: acceptedFiles
        }))

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


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}

            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>{dialog_type} Image</DialogTitle>
                    <DialogContent sx={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <Grid2
                            container
                            spacing={2}
                            columns={12}
                        >
                            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <FormControl>
                                    <FormLabel htmlFor="description">Description</FormLabel>
                                    <TextField
                                        id="description"
                                        type="text"
                                        name="description"
                                        placeholder=""
                                        autoComplete="description"
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: 'auto',
                                            },
                                        }}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <FormControl>
                                    <FormLabel htmlFor="name">Image Name</FormLabel>
                                    <TextField
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder=""
                                        autoComplete="name"
                                        autoFocus
                                        required
                                        fullWidth
                                        value={formData.name}
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        slotProps={{
                                            input: {
                                                readOnly: dialog_type === 'View',
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderStyle: "dashed",
                                        borderWidth: "4px",
                                        borderColor: "#cacfdb",
                                        padding: "2%",
                                        borderRadius: "25px",
                                        display: dialogType === 'View' ? 'none' : 'static'
                                    }}
                                >
                                    <div {...getRootProps()}>
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
                                                    >{formData.file && formData.file.length > 0 ? formData.file[0].name : "Browse File"}
                                                    </Button>
                                                </Box>
                                                <Box>
                                                    <Typography>{formData.file && formData.file.length > 0 ? "Change " : "Choose "}
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
                                </Paper>
                            </Grid2>
                        </Grid2>

                    </DialogContent>

                    <DialogActions sx={{
                        display: dialogType === 'View' ? 'none' : 'static'
                    }}>
                        <Button disabled={loading} type="submit" variant="contained" sx={{ width: '100%' }}>Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default MyDialog;
