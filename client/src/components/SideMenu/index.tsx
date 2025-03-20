import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuList from '@/components/SideMenu/MenuList';


import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // Import types

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
    const { open } = useSelector((state: RootState) => state.navBar);
    return (
        <>
            <Drawer
                open={open}
                variant="persistent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    [`& .${drawerClasses.paper}`]: {
                        backgroundColor: 'background.paper',
                    },
                }}
            >
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