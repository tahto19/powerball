//@ts-nocheck
import { Box, Button, CardMedia, styled, CircularProgress, } from "@mui/material";
import image1 from "@/assets/image/viber_image_2026-03-09_14-05-36-249.jpg"
import EDialog from "./Dialog";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useTheme, useMediaQuery } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import apiService from "@/services/apiService";
import { bodyDecrypt } from "@/utils/util";

const Escratch = ({ points }: { points: number }) => {
    const { token } = useAppSelector((state) => state.token);

    const theme = useTheme();
    //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    // const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const [open, setOpen] = useState(false);
    const handleOnClose = () => {
        setOpen(false);
    }

    const [imageList, setImageList] = useState([])
    const [isFetching, setIsFetching] = useState(false);

    const getHighlights_PlayerSide = async () => {
        if (!token) return;

        setIsFetching(true);

        const res = await apiService.getHighlights_PlayerSide(token);

        const d = bodyDecrypt(res.data, token);
        setIsFetching(false);

        if (d && d.success === "success") {
            const data = d.data.list?.sort((a, b) => a.sequence - b.sequence)
            setImageList(data);
        }
    };


    useEffect(() => {
        getHighlights_PlayerSide()
    }, [token])

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                {isFetching ? (
                    <CircularProgress color="inherit" />
                ) : (
                    <>
                        <Box sx={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            borderRadius: "20px",
                            width: isDesktop ? "70%" : "100%"
                        }}>
                            <Swiper
                                spaceBetween={30}
                                centeredSlides={true}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                pagination={{
                                    clickable: true,
                                }}
                                modules={[Autoplay, Pagination, Navigation]}
                            >
                                {/* <SwiperSlide key={1}>
                                    <img
                                        src={image1}
                                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                    />
                                </SwiperSlide>
                                <SwiperSlide key={2}>
                                    <img
                                        src={image1}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </SwiperSlide> */}
                                {
                                    imageList.length > 0 ? (
                                        imageList.map((img, i) => (
                                            <SwiperSlide key={i}>
                                                <img
                                                    src={img.file_location}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </SwiperSlide>
                                        ))
                                    ) : (
                                        <SwiperSlide key={1}>
                                            <img
                                                src={image1}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </SwiperSlide>
                                    )
                                }

                            </Swiper>
                            {/* <CardMedia
                        component="img"
                        image={image1}
                        alt="Image"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    >

                    </CardMedia> */}

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
                    </>
                )
                }

            </div>
            <EDialog points={points} open={open} onClose={handleOnClose} />
            <br />
        </>
    );
}

export default Escratch;