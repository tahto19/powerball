//@ts-nocheck

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuList from '@/components/SideMenu/MenuList';
import OptionsMenu from '@/components/SideMenu/OptionsMenu';
import { useMediaQuery, useTheme } from "@mui/material";


import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // Import types
import { openNav } from '@/redux/reducers/navBarSlice';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});
export default function SideMenu() {
    const dispatch = useDispatch<AppDispatch>();

    const { open } = useSelector((state: RootState) => state.navBar);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const userDetails = useSelector((state: RootState) => state.user);
    console.log(userDetails)

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
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                        PowerBall ScratchIt
                    </Typography>
                </Box>
                <Divider />
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
                <Stack
                    direction="row"
                    sx={{
                        p: 2,
                        gap: 1,
                        alignItems: 'center',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Avatar
                        sizes="small"
                        alt="Riley Carter"
                        sx={{ width: 36, height: 36 }}
                    >{userDetails.firstname?.charAt(0).toUpperCase()}</Avatar>
                    <Box sx={{ mr: 'auto' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                            {userDetails.fullname}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {userDetails.emailAddress}
                        </Typography>
                    </Box>
                    <OptionsMenu />
                </Stack>
            </Drawer>
        </>
    )
}