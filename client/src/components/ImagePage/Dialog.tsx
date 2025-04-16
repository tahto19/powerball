
import { initialImageData2, DialogProps, ImageState2 } from "./interface.ts"
import { Typography, Box, Stack, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormLabel, FormControlLabel, Grid2 } from '@mui/material';
import MuiFormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FormControl = styled(MuiFormControl)(() => ({
    width: "100%"
}));


const MyDialog = ({ open, data, dialogType, onClose, onSubmit }: DialogProps) => {
    const [formData, setData] = useState<ImageState2>(initialImageData2);
    const [dialog_type, setDialogType] = useState("")

    const handleSubmit = (event: React.FocusEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.file || formData.file.length === 0) {
            return;
        }

        console.log(formData)
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

                    <DialogActions>
                        <Button type="submit" variant="contained" sx={{ width: '100%' }}>Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default MyDialog;
