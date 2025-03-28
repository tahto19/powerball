//@ts-nocheck

import * as React from 'react';
import { useLocation } from "react-router-dom";

import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuButton from '@/components/MenuButton';

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // Import types
import { openNav } from '@/redux/reducers/navBarSlice';
const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(100% - ${drawerWidth}px)`,
                [theme.breakpoints.down('sm')]: {
                    width: '100%', // Change only for small screens
                },
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                boxShadow: 0,
                back: 'background.paper',
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
            },
        },
    ],
}));
const Toolbar = styled(MuiToolbar)({
    width: '100%',
    // padding: '6px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    gap: '12px',
    flexShrink: 0,
    [`& ${tabsClasses.flexContainer}`]: {
        gap: '8px',
        p: '8px',
        pb: 0,
    },
});

export default function AppNavbar({ title }: { title: string }) {
    const dispatch = useDispatch<AppDispatch>();
    const { open } = useSelector((state: RootState) => state.navBar);

    const location = useLocation();

    // const currentRoute = routes.find(route => route.path === location.pathname);
    // console.log(title)
    // const pageTitle = currentRoute?.title || " ";
    return (
        <AppBar
            position="fixed"
            open={open}
            sx={{
                boxShadow: 0,
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                top: 'var(--template-frame-height, 0px)',
            }}
        >
            <Toolbar variant="regular">
                <Stack
                    direction="row"
                    sx={{
                        alignItems: 'center',
                        flexGrow: 1,
                        width: '100%',
                        gap: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: 'center', mr: 'auto' }}
                    >
                        <MenuButton aria-label="menu" onClick={() => dispatch(openNav(!open))}>
                            <MenuRoundedIcon />
                        </MenuButton>
                        <Typography variant="h5" sx={{ color: 'text.primary', display: "flex", alignItems: "center" }}>
                            {title}
                        </Typography>
                    </Stack>

                </Stack>
            </Toolbar>
        </AppBar>
    );
}
