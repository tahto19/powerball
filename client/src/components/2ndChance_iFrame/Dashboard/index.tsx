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
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Raffles from "../Raffles/Raffles";
import play from '@/assets/icon/play.png'
import { useNavigate } from "react-router-dom";
import { MyEntries } from "../UserTicketDetails/MyEntries";
import TicketScannedList from "@/components/ticketScanner/TicketScannedList";
import WinnerDetails from "@/components/2ndChance_iFrame/winner/WinnerDetails";
import { useAppSelector } from "@/redux/hook";


const base_url = import.meta.env.VITE_API_BASE_URL;
const endpoint = base_url + "api/file/serve/image/"

const tabStyles = {
    background: 'rgba(242, 106, 33, 0.20)',
    color: '#702DFF',
    borderRadius: '100%',
    padding: '5px',
    fontSize: '16px'
}
const tabs = [
    {
        text: 'My Entries',
        type: 'entries',
        icon: <NotificationsNoneIcon sx={tabStyles} />,
    },
    {
        text: 'Winners',
        type: 'winners',
        icon: <NotificationsNoneIcon sx={tabStyles} />,
    },
    {
        text: 'ETC',
        type: 'etc',
        icon: <NotificationsNoneIcon sx={tabStyles} />,
    },
]

const Dashboard = () => {
    const { overallTotalEntries, totalEntries } = useAppSelector(
        (state) => state.raffleEntry
    );
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/scanner");
    };
    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    height: '181px',
                    alignSelf: 'stretch',
                    background: `url(${endpoint + 5}) transparent 50% / contain no-repeat`,
                }}
            >
                {/* <CardMedia
                    component="img"
                    sx={{ width: 300 }}
                    image={endpoint + 11}
                    alt="Logo"
                >

                </CardMedia> */}

                <Box sx={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <Box
                        onClick={handleNavigation}
                        sx={{
                            display: 'inline-flex',
                            height: '36px',
                            padding: '8px 12px',
                            alignItems: 'center',
                            gap: '12px',
                            flexShrink: '0',
                            borderRadius: '40px',
                            background: '#202020',
                            color: '#fff',
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: '0.9'
                            }
                        }}>
                        Enter Ticket
                        <div style={{
                            display: 'flex',
                            width: '20px',
                            height: '20px',
                            padding: '6px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                            borderRadius: '50px',
                            background: '#FFF'
                        }}>
                            <img src={play} />
                        </div>
                    </Box>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            height: '36px',
                            padding: '8px 12px',
                            alignItems: 'center',
                            gap: '12px',
                            flexShrink: '0',
                            borderRadius: '40px',
                            background: '#F26A21',
                            color: '#fff',
                        }}>
                        Available Raffle Ticket: {overallTotalEntries}

                    </Box>
                </Box>
            </Box>

            <Box sx={{
                my: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '13px',
                alignSelf: 'stretch',
                flexWrap: 'wrap'
            }}>
                {
                    tabs.map(x => (
                        <Card sx={{
                            display: 'flex',
                            padding: '12px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '17px',
                            flex: '1 0 0',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#FFF',
                            boxShadow: '0px 14px 42px 0px rgba(8, 15, 52, 0.06)',
                        }}>
                            {x.icon}
                            <Typography>{x.text}</Typography>
                        </Card>
                    ))
                }

            </Box>
            <Raffles />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    // alignItems: 'center',
                    gap: '24px',
                    // flex: '1 0 0',
                    // alignSelf: 'stretch',
                    padding: '0 15px',
                    marginTop: '24px'
                }}>
                <MyEntries />
                <TicketScannedList url="myScan" />
                <WinnerDetails />
            </Box>
        </>
    )
}

export default Dashboard;