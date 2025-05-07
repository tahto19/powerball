//@ts-nocheck

import * as React from 'react';
import { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuList from './MenuList';
import OptionsMenu from './OptionsMenu';
import { useMediaQuery, useTheme } from "@mui/material";


import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // Import types
import { openNav } from '@/redux/reducers/navBarSlice';
const base_url = import.meta.env.VITE_API_BASE_URL;
const endpoint = base_url + "api/file/serve/image/"

const drawerWidth = 200;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
        borderRight: "none !important",
        boxShadow: '0px 14px 42px 0px rgba(8, 15, 52, 0.06)'
    },
});
export default function SideMenu() {
    const dispatch = useDispatch<AppDispatch>();
    const userDetails = useSelector((state: RootState) => state.user);
    const [data, setData] = useState(userDetails)

    const { open } = useSelector((state: RootState) => state.navBar);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [refreshKey, setRefreshKey] = useState(0);
    // Call this function when data updates
    const refreshImage = () => setRefreshKey((prev) => prev + 1);
    useEffect(() => {
        setData(userDetails)
        refreshImage()
    }, [userDetails])
    return (
        <>
            <Drawer
                open={open}
                onClose={() => dispatch(openNav(!open))}
                variant={isSmallScreen ? "temporary" : "persistent"} // Change variant based on screen size
                sx={{
                    display: { xs: 'block', md: 'block' },
                    [`& .${drawerClasses.paper}`]: {
                        backgroundColor: 'background.paper',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                        p: 1.5,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                        Your Profile
                    </Typography>
                    <OptionsMenu />
                </Box>
                <Stack
                    direction="column"
                    sx={{
                        p: '0 2px 2px 2px',
                        gap: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Avatar
                        sizes="small"
                        alt="Riley Carter"
                        src={data.fileInfo.id ? endpoint + data.fileInfo.id + `?t=${refreshKey}` : ""}
                        sx={{ width: "100px", height: "100px" }}
                    />
                    <Box sx={{ mr: 'auto', textAlign: 'center', width: '100%' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                            {data.fullname}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {data.emailAddress}
                        </Typography>
                    </Box>
                </Stack>
                {/* <Box
                    sx={{
                        display: 'flex',
                        mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                        p: 1.5,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                        PowerBall ScratchIt
                    </Typography>
                </Box> */}
                <Box
                    sx={{
                        overflow: 'auto',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <MenuList />
                </Box>
            </Drawer>
        </>
    )
}