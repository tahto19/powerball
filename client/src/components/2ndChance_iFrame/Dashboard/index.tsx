//@ts-nocheck
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Raffles from "../Raffles/Raffles";
import play from "@/assets/icon/play.png";
import { useNavigate } from "react-router-dom";
import { MyEntries } from "../UserTicketDetails/MyEntries";
import TicketScannedList from "@/components/ticketScanner/TicketScannedList";
import WinnerDetails from "@/components/2ndChance_iFrame/winner/WinnerDetails";
import { useAppSelector } from "@/redux/hook";
import EntriesDialog from "./EntriesDialog";
import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import logo from "@/assets/image/logo.png";
import apiService from "@/services/apiService";
import { MediaState, mediaInitialData } from "@/components/Defaults/tabs/interface"
import { bodyDecrypt } from "@/utils/util";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import IconButton from '@mui/material/IconButton';

const base_url = import.meta.env.VITE_API_BASE_URL;
const endpoint = base_url + "api/file/serve/image/";

const tabStyles = {
  background: "rgba(242, 106, 33, 0.20)",
  color: "#702DFF",
  borderRadius: "100%",
  padding: "5px",
  fontSize: "16px",
};
const tabs = [
  {
    text: "My Entries",
    type: "entries",
    icon: <NotificationsNoneIcon sx={tabStyles} />,
  },
  {
    text: "Winners",
    type: "winners",
    icon: <NotificationsNoneIcon sx={tabStyles} />,
  },
  {
    text: "ETC",
    type: "etc",
    icon: <NotificationsNoneIcon sx={tabStyles} />,
  },
];

const Dashboard = () => {
  // const { overallTotalEntries, totalEntries, totalTicket, totalUsedEntries } = useAppSelector(
  //     (state) => state.raffleEntry
  // );
  const { token } = useAppSelector((state) => state.token);

  const userDetails = useAppSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/scanner");
  };
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<MediaState>(mediaInitialData);
  const [isImage, setIsImage] = useState(false)
  const [hasData, setHasData] = useState(false)
  const GetData = async () => {
    setHasData(false)
    let res = await apiService.getMediaBanner();
    const d = bodyDecrypt(res.data, token)

    if (d.success === 'success') {
      if (d.data && d.data.type) {
        const type = d.data.type === 'image' ? true : false;
        setIsImage(type)
        setFormData(d.data);
        setHasData(true)
      }
    }
    console.log(d)
  }

  const [availableTicket, setavailableTicket] = useState(0);
  useEffect(() => {
    let total = 0;

    if (
      Array.isArray(userDetails.ticket_details) &&
      userDetails.ticket_details.length > 0
    ) {
      const totalEntries =
        Number(userDetails.ticket_details[0].totalEntries) || 0;
      const totalUsedEntries =
        Number(userDetails.ticket_details[0].totalUsedEntries) || 0;
      total = totalEntries - totalUsedEntries;
    }

    if (total > 0) {
      setavailableTicket(total);
    } else {
      setavailableTicket(0); // or handle negative case
    }
    GetData()
  }, [userDetails]);

  const [open, setOpen] = useState(false);
  const handleClose = (val) => {
    setOpen(val);
  };
  const handleOpen = (val) => {
    setOpen(true);
  };

  const [isOff, setIsOff] = useState(false)
  const handleVolume = () => {
    console.log("volume")
    setIsOff(!isOff)
  }

  return (
    <>
      <Box
        sx={{
          position: "relative",
          // height: isSmallScreen ? '300px' : '181px',
          // alignSelf: 'stretch',
          // background: `url(${endpoint + 5}) transparent 50% / contain no-repeat`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px",
        }}
      >
        {
          hasData ?

            isImage ? (
              <CardMedia
                component="img"
                sx={{ width: "fit-content", height: "181px" }}
                image={endpoint + formData.id}
                alt="Logo"
              ></CardMedia>
            ) : (
              // <CardMedia
              //   component="video"
              //   sx={{ width: "fit-content", height: "181px" }}
              //   src={"https://18.138.76.86/media/videos/" + formData.file_location}
              //   autoPlay
              //   loop
              // />
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: isSmallScreen ? "auto" : "281px",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "10px",
                  '&:hover .play-box': {
                    display: "flex"
                  },
                  "& .play-box": {
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    display: "none",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(0, 0, 0, 0.7)",
                  },
                }}
              >
                <div className="play-box">
                  <IconButton sx={{ zIndex: "100", borderRadius: "100%" }} size="large" onClick={handleVolume}>
                    {
                      isOff ? (<VolumeOffIcon fontSize="inherit" />) : (<VolumeUpIcon fontSize="inherit" />)
                    }
                  </IconButton>
                </div>
                <video
                  src={`/media/videos/${formData.file_location}`}
                  autoPlay
                  loop
                  muted={isOff}
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // behaves like background-size: cover
                  }}
                />
              </Box>
            )

            : null

        }


        {/* <CardMedia
          component="img"
          sx={{ width: "fit-content", height: "181px" }}
          image={logo}
          alt="Logo"
        ></CardMedia> */}

        <Box
          sx={{
            // position: 'absolute',
            // bottom: '0',
            // left: '0',
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "start",
            width: "100%",
          }}
        >
          <Box
            onClick={handleNavigation}
            sx={{
              display: "inline-flex",
              height: "36px",
              padding: "8px 12px",
              alignItems: "center",
              gap: "12px",
              flexShrink: "0",
              borderRadius: "40px",
              background: "#202020",
              color: "#fff",
              cursor: "pointer",
              "&:hover": {
                opacity: "0.9",
              },
            }}
          >
            Enter Ticket
            <div
              style={{
                display: "flex",
                width: "20px",
                height: "20px",
                padding: "6px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                borderRadius: "50px",
                background: "#FFF",
              }}
            >
              <img src={play} />
            </div>
          </Box>
          <Box
            sx={{
              display: "inline-flex",
              height: "36px",
              padding: "8px 12px",
              alignItems: "center",
              gap: "12px",
              flexShrink: "0",
              borderRadius: "40px",
              background: "#F26A21",
              color: "#fff",
              cursor: "pointer",
              "&:hover": {
                opacity: "0.9",
              },
            }}
            onClick={handleOpen}
          >
            Available Raffle Ticket: {availableTicket}
          </Box>
        </Box>
      </Box>

      {/* <Box
        sx={{
          my: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "13px",
          alignSelf: "stretch",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((x, i) => (
          <Card
            key={i}
            sx={{
              display: "flex",
              padding: "12px",
              justifyContent: "center",
              alignItems: "center",
              gap: "17px",
              flex: "1 0 0",
              borderRadius: "12px",
              border: "none",
              background: "#FFF",
              boxShadow: "0px 14px 42px 0px rgba(8, 15, 52, 0.06)",
            }}
          >
            {x.icon}
            <Typography>{x.text}</Typography>
          </Card>
        ))}
      </Box> */}
      <br />
      <br />
      <Raffles />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // alignItems: 'center',
          gap: "24px",
          // flex: '1 0 0',
          // alignSelf: 'stretch',
          padding: isSmallScreen ? "0" : "0 15px",
          marginTop: "24px",
        }}
      >
        <MyEntries />
        <TicketScannedList url="myScan" />
        <WinnerDetails />
      </Box>
      <EntriesDialog
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

export default Dashboard;
