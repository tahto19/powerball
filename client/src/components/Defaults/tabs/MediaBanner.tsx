//@ts-nocheck
import logo from "@/assets/image/logo.png";
import {
    CardMedia,
    Typography,
    Button,
    Box,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { MediaState, mediaInitialData } from "./interface"
import apiService from "@/services/apiService";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { bodyDecrypt } from "@/utils/util";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const base_url = import.meta.env.VITE_API_BASE_URL;
const apiEndpoint = base_url + "api/file/serve/image/"

const MediaBanner = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.token);
    const [formData, setFormData] = useState<MediaState>(mediaInitialData);
    const [isImage, setIsImage] = useState(false)
    const [hasData, setHasData] = useState(false)
    const [date, setDate] = useState(Date.now())
    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        console.log(event.target.files)
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        // Type check
        if (selectedFile.type.startsWith("image/")) {
            console.log("It's an image!");
            setIsImage(true);
        } else if (selectedFile.type.startsWith("video/")) {
            console.log("It's a video!");
            setIsImage(false);
        } else {
            console.log("Unsupported file type");
            return;
        }

        const file = event.target.files?.[0] ?? null; // safely get first file or null
        const name = event.target.files?.[0].name ?? '';

        setFormData((prev) => {
            return {
                ...prev,
                file,
                name: name,
                category: 'media-banner'
            }
        });

    }

    const SubmitData = async () => {
        if (!formData.file) {
            console.log("no file")
            return;
        }

        let message;
        let res;
        // setLoading(true)
        if (!formData.id) {
            res = await apiService.createMediaBanner(formData, token);
            message = "Record updated successfully."
        } else {
            res = await apiService.updateMediaBanner(formData, token);
            message = "Record created successfully."
        }
        GetData();
        // const d = bodyDecrypt(res.data, token)
    }

    const GetData = async () => {
        setHasData(false)
        let res = await apiService.getMediaBanner();
        const d = bodyDecrypt(res.data, token)

        if (d.success === 'success') {
            console.log(d.data)
            if (d.data && d.data.type) {
                const type = d.data.type === 'image' ? true : false;
                setIsImage(type)
                setFormData(d.data);
                setHasData(true)
                setDate(Date.now())//to refresh media when updated
            }
        }
        console.log(d)
    }
    useEffect(() => {
        SubmitData();
    }, [formData])
    useEffect(() => {
        GetData();
    }, [])

    return (
        <>
            <Typography>The Media Banner is the top section of your second chance site where you can showcase your brand. You can upload a logo, an image, or a video to make a strong first impression. This banner appears above all other content and represents the visual identity of your site.</Typography>
            {
                hasData ?

                    isImage ? (
                        <CardMedia
                            key={date}
                            component="img"
                            sx={{ width: "fit-content", height: "181px", border: "3px solid #000", borderRadius: "10px", marginTop: "20px" }}
                            image={apiEndpoint + formData.id + "?t=" + date}
                            alt="Logo"
                        ></CardMedia>
                    ) : (
                        <CardMedia
                            key={date}
                            component="video"
                            sx={{ maxWidth: "100%", width: "fit-content", height: "181px", border: "3px solid #000", borderRadius: "10px", marginTop: "20px" }}
                            src={"/media/videos/" + formData.file_location + "?t=" + date}
                            controls
                        />
                    )

                    : null

            }


            <Box
                sx={{
                    background: "#fff",
                    marginTop: "20px"
                }}
            >
                <Box
                    sx={{
                        background: "#fff",
                        padding: "15px",
                        border: "1px solid hsla(220, 20%, 80%, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        justifyContent: "space-between"
                    }}
                >
                    <Typography>Choose a Photo/Video</Typography>
                    <Button component="label"
                        role={undefined}
                        tabIndex={-1} variant="contained">Browse
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(event) => handleChange(event)}
                            accept="image/*,video/*" // Only images and videos
                        />
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default MediaBanner;