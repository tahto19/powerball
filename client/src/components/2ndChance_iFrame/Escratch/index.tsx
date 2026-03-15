import { Box, Button, CardMedia } from "@mui/material";
import image1 from "@/assets/image/Screenshot 2026-03-14 160244.png"
import EDialog from "./Dialog";
import { useState } from "react";
const Escratch = ({ points }: { points: number | string }) => {
    const [open, setOpen] = useState(false);
    const handleOnClose = () => {
        setOpen(false);
    }
    return (
        <>
            <Box sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                borderRadius: "20px"

            }}>
                <CardMedia
                    component="img"
                    image={image1}
                    alt="Image"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                >

                </CardMedia>

                <Button onClick={() => setOpen(true)} variant="contained" sx={{
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                    maxWidth: "70%",
                }}>Play Now</Button>
            </Box>
            <EDialog points={points} open={open} onClose={handleOnClose} />
        </>
    );
}

export default Escratch;