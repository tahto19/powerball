//@ts-nocheck
import {
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
import { toast } from "react-toastify";
import SortableImage from "./SortableImage";
import {
    DndContext,
    closestCenter
} from "@dnd-kit/core";
import { showToaster } from "@/redux/reducers/global/globalSlice";

import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";

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

const Highlights = () => {
    const dispatch = useAppDispatch();
    const { myPermission } = useAppSelector((state: RootState) => state.userType);

    const { token } = useAppSelector((state) => state.token);

    const [formData, setFormData] = useState<MediaState>(mediaInitialData);

    const [imageList, setImageList] = useState<MediaState[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (!myPermission.second_chance_site_defaults.brows) {
            toast.info("You are not allowed to Add");
            return;
        }
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        // Type check
        if (selectedFile.type.startsWith("image/")) {
            console.log("It's an image!");
        } else {
            console.log("Unsupported file type");
            return;
        }

        const file = event.target.files?.[0] ?? null; // safely get first file or null
        const name = event.target.files?.[0].name ?? '';

        setFormData({
            id: null,
            file,
            name: name,
            category: 'highlights',
            sequence: imageList.length + 1
        });
    }

    const SubmitData = async () => {
        if (!formData.file) {
            console.log("no file")
            return;
        }

        setIsSubmitting(true)
        let message;
        let res;
        // setLoading(true)
        if (!formData.id) {
            res = await apiService.createMediaBanner(formData, token);
            message = "Image uploaded successfully."
            const d = bodyDecrypt(res.data, token)
            console.log("asdasdasd", d)
            if (d.success === 'success') {
                dispatch(
                    showToaster({
                        message: message,
                        show: true,
                        variant: "success",
                        icon: null,
                    })
                );
                GetData();
            }
        }
        setIsSubmitting(false)
        // const d = bodyDecrypt(res.data, token)
    }

    const GetData = async () => {
        setIsChangeSequence(false)
        let res = await apiService.getHighlights();
        const d = bodyDecrypt(res.data, token)

        if (d.success === 'success') {
            if (d.data?.list.length > 0) {
                // let data = d.data?.list.map(x => {
                //     x.file_location = "https://18.138.76.86/media/images/01-13-2026-927429-2N62P-PAL 2ND CHANCE v2 Coming soon.png";
                //     return x
                // })
                let data = d.data?.list
                data = data.sort((a: any, b: any) => a.sequence - b.sequence)
                setImageList(data)
            }
        }
    }

    const [isChangeSequence, setIsChangeSequence] = useState(false);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setImageList((items) => {
                const oldIndex = items.findIndex(i => i.sequence === active.id);
                const newIndex = items.findIndex(i => i.sequence === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // update sequence here
                const updated = newItems.map((item, index) => ({
                    ...item,
                    sequence: index + 1
                }));

                setIsChangeSequence(true)

                return updated;
            });
        }
    };

    const onImageDelete = async (row: any) => {
        let res = await apiService.deleteHighlights({ id: row.id }, token);
        if (res.success === 'success') {
            dispatch(
                showToaster({
                    message: "Image deleted successfully!",
                    show: true,
                    variant: "success",
                    icon: null,
                })
            );
            setImageList(prev => prev.filter(i => i.id !== row.id))
        }
    }

    const updateSequence = async () => {
        let res = await apiService.updateHighlightsSequence({ list: imageList }, token);
        if (res.success === 'success') {
            dispatch(
                showToaster({
                    message: "Image sequence successfully!",
                    show: true,
                    variant: "success",
                    icon: null,
                })
            );
            GetData();
        }
    }

    useEffect(() => {
        SubmitData();
    }, [formData])
    useEffect(() => {
        GetData();
    }, [])

    return (
        <>
            <Typography>Highlights is a section where you can display rotating content to capture attention and engage players. You can upload images or other media to showcase featured items, announcements, or promotions. This section appears within the site and helps highlight important or timely content.</Typography>

            <Box sx={{
                display: 'flex',
                gap: '8px',
                marginTop: "20px"
            }}>

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={imageList.map(i => i.sequence)} strategy={verticalListSortingStrategy}>

                        <Box sx={{ display: "flex", gap: "8px", marginTop: "20px" }}>
                            {imageList.map((x) => (
                                <SortableImage
                                    key={x.sequence}
                                    id={x.sequence}
                                    x={x}
                                    onDelete={onImageDelete}
                                />
                            ))}
                        </Box>

                    </SortableContext>
                </DndContext>
            </Box>
            {
                isChangeSequence ? (
                    <Button
                        sx={{
                            marginTop: "20px"
                        }}
                        component="label"
                        role={undefined}
                        onClick={updateSequence}
                        tabIndex={-1} variant="contained">Save Sequence
                    </Button>
                ) : null
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
                    <Typography>Choose a Photo</Typography>
                    <Button component="label"
                        disabled={isSubmitting}
                        role={undefined}
                        tabIndex={-1} variant="contained">Browse
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(event) => handleChange(event)}
                            accept="image/*" // Only images and videos
                        />
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default Highlights;