import { DialogContentText, Box, Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from 'react';
import { initialImageData, ProfileDialogProps } from "./interface.ts"
import { bodyDecrypt } from "@/utils/util";
import { showToaster } from "@/redux/reducers/global/globalSlice"
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import apiService from "@/services/apiService";
import Avatar from '@mui/material/Avatar';

const base_url = import.meta.env.VITE_API_BASE_URL;
const endpoint = base_url + "api/file/serve/image/"
const ProfileDialog = ({ open, fileInfo, onClose, onSubmit }: ProfileDialogProps) => {
    const [imageData, setImageData] = useState(initialImageData);
    const [preview, setPreview] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.token);

    const handleSubmit = async () => {

        if (!imageData.file || imageData.file.length === 0) {
            dispatch(showToaster({
                message: "Image not found",
                show: true,
                variant: "error",
                icon: null,
            }))
            return;
        }


        let message;
        let res;

        if (imageData.id) {
            res = await apiService.updateImage(imageData, token);
            message = "Record updated successfully."
        } else {
            res = await apiService.createImage(imageData, token);
            message = "Record created successfully."
        }

        const d = bodyDecrypt(res.data, token)

        if (d && d.success === 'success') {
            dispatch(showToaster({
                message: message,
                show: true,
                variant: "success",
                icon: null,
            }))
            setImageData(initialImageData)
            setPreview(null)
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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        // setData((prev) => ({
        //     ...prev,
        //     name: acceptedFiles.length > 0 ? acceptedFiles[0].name.split(".")[0] : prev.name,
        //     file: acceptedFiles
        // }))

        setImageData((prev) => ({
            ...prev,
            name: acceptedFiles.length > 0 ? acceptedFiles[0].name.split(".")[0] : prev.name,
            file: acceptedFiles,
            category: 'user-image'
        })
        )
        if (acceptedFiles[0]) {
            setPreview(URL.createObjectURL(acceptedFiles[0])); // Create temporary URL for preview
        }

    }, []);
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "image/png": [".png"],
            "image/jpg": [".jpg"],
            "image/jpeg": [".jpeg"],
        },
        onDrop,
        multiple: false,
    });

    const handleClose = () => {
        onClose(true)
    }

    useEffect(() => {
        if (fileInfo && fileInfo.id) {
            setImageData((prev) => ({
                ...prev,
                ...fileInfo
            }))
            setPreview(endpoint + fileInfo.id + `?t=${Date.now()}`)//?t=${Date.now()} is for refresh purposes
        } else {
            setImageData(initialImageData)
            setPreview(null)
        }
    }, [fileInfo])
    return (<>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ borderBottom: 'none' }}>
                User Profile
            </DialogTitle>
            <DialogContent sx={{ pt: '0 !important' }}>
                <DialogContentText>
                    Allows you to upload or select a new profile picture. You can preview your selected image before saving changes. Accepted formats include JPG and PNG.
                </DialogContentText>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    mt: 4,
                }}>

                    <div {...getRootProps()}>
                        <Box sx={{
                            position: 'relative',
                            width: '170px',
                            height: '170px',
                            borderRadius: '100%',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            '&:hover .overlay': {
                                display: 'flex !important',
                            }
                        }}>
                            <Button className="overlay" style={{
                                position: 'absolute',
                                display: 'none',
                                justifyContent: 'center',
                                alignItems: 'center',
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background: 'rgba(0,0,0, 0.7)',
                                color: '#fff',
                                zIndex: 100,
                            }}>
                                <CameraAlt />
                            </Button>
                            <Avatar
                                sizes="small"
                                alt="Riley Carter"
                                src={preview ? preview : ""}
                                sx={{ width: "170px", height: "170px" }}
                            />
                            {/* {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{ width: "100%", height: "100%", objectFit: 'cover' }}
                                />
                            ) : <AccountCircle sx={{ fontSize: '170px', color: '#ccc', opacity: "0.7" }} />} */}
                        </Box>
                    </div>
                    <input {...getInputProps()} />
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: "100%",
                    mt: 4
                }}>
                    <Button onClick={handleSubmit} variant="contained" color="info" sx={{ px: 4 }}>Save Image</Button>
                </Box>
            </DialogContent>
        </Dialog>
    </>);
}

export default ProfileDialog;