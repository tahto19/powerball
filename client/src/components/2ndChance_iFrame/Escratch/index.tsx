//@ts-nocheck
import { Box, Button, CardMedia } from "@mui/material";
import image1 from "@/assets/image/viber_image_2026-03-09_14-05-36-249.jpg"
import EDialog from "./Dialog";
import { useState } from "react";
const Escratch = ({ points }: { points: number }) => {
    const [open, setOpen] = useState(false);
    const handleOnClose = () => {
        setOpen(false);
    }
    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                <Box sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    borderRadius: "20px",
                    width: "100%"

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

                    {/* <Button onClick={() => setOpen(true)} variant="contained" sx={{
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                    maxWidth: "70%",
                }}>Play Now</Button> */}
                </Box>
                <Button onClick={() => setOpen(true)} variant="contained" sx={{
                    margin: "10px",
                    width: "100%",
                    maxWidth: "50%",
                    borderRadius: "30px",
                    height: "52px",
                    padding: "8px 12px",
                    fontSize: "16px",
                    color: "#fff",
                    background: "#b30000"
                }}>Play Now</Button>
            </div>
            <EDialog points={points} open={open} onClose={handleOnClose} />
            <br />
        </>
    );
}

export default Escratch;