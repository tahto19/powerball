import { Box, Typography } from "@mui/material";

import { Time } from "./interface"

const CountDown = ({ time }: Time) => {

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <Typography sx={{ fontWeight: "500", fontSize: "20px", textWrap: "nowrap" }}>Draw closes in: </Typography>
                <div style={{ display: 'flex', gap: "8px" }}>
                    <div style={{ display: 'flex', gap: "3px" }}>
                        <Typography sx={{
                            borderRadius: "4px 4px 0px 0px",
                            padding: "0 3px",
                            backgroundColor: "rgb(220, 227, 231)",
                            fontWeight: "600"
                        }}>{time.days}</Typography>
                        <Typography sx={{ color: "rgb(129, 133, 140)" }}>D</Typography>
                    </div>
                    <div style={{ display: 'flex', gap: "3px" }}>
                        <Typography sx={{
                            borderRadius: "4px 4px 0px 0px",
                            padding: "0 3px",
                            backgroundColor: "rgb(220, 227, 231)",
                            fontWeight: "600"
                        }}>{time.hours}</Typography>
                        <Typography sx={{ color: "rgb(129, 133, 140)" }}>H</Typography>
                    </div>
                    <div style={{ display: 'flex', gap: "3px" }}>
                        <Typography sx={{
                            borderRadius: "4px 4px 0px 0px",
                            padding: "0 3px",
                            backgroundColor: "rgb(220, 227, 231)",
                            fontWeight: "600"
                        }}>{time.minutes}</Typography>
                        <Typography sx={{ color: "rgb(129, 133, 140)" }}>M</Typography>
                    </div>
                    <div style={{ display: 'flex', gap: "3px" }}>
                        <Typography sx={{
                            borderRadius: "4px 4px 0px 0px",
                            padding: "0 3px",
                            backgroundColor: "rgb(220, 227, 231)",
                            fontWeight: "600"
                        }}>{time.seconds}</Typography>
                        <Typography sx={{ color: "rgb(129, 133, 140)" }}>S</Typography>
                    </div>
                </div>
            </Box>
        </>
    );
}

export default CountDown;