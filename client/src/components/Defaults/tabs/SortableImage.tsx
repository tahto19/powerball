import {
    CardMedia,
    Box,
    IconButton
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";


import {
    useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

interface MyDialogProps {
    id: number | null;
    x: any;
    onDelete: (value: any) => void;
}
const SortableImage = ({ id, x, onDelete }: MyDialogProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id ? id : 0 });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const deleteImage = () => {
        onDelete(x)
    }
    return (
        <Box ref={setNodeRef} style={style}
            sx={{
                position: "relative",
                borderRadius: "10px",
                overflow: "hidden",
                '& .image-overlay': {
                    display: "none",
                    position: "absolute",
                    right: "0",
                    top: "0",
                    height: "100%",
                },
                '&:hover .image-overlay': {
                    display: "flex",

                }
            }}
        >
            <Box {...attributes} {...listeners}>
                <CardMedia
                    component="img"
                    sx={{ width: "181px" }}
                    image={"/media/images/" + x?.file_location}
                // image={x?.file_location}

                />
            </Box>


            <Box className="image-overlay">
                <div
                    style={{
                        padding: "10px"
                    }}
                >
                    <IconButton
                        sx={{
                            backgroundColor: "black",
                            "&:hover": {
                                backgroundColor: "white",
                                "& svg": { color: "black" }
                            }
                        }}
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImage() }}

                    >
                        <DeleteIcon sx={{ color: "white" }} />
                    </IconButton>
                </div>
            </Box>
        </Box >
    );
}

export default SortableImage;