//@ts-nocheck

import { useEffect } from "react";

import SideMenu from "@/components/SideMenu";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// import Header from "@/components/Header/NavbarBreadCrumbs";
import AppNavBar from "@/components/Header/AppNavBar";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import { useMediaQuery, useTheme } from "@mui/material";
// const theme = useTheme();
// const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: -drawerWidth,
  [theme.breakpoints.down("sm")]: {
    marginLeft: "auto", // Change only for small screens
  },
  /**
   * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
   * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
   * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
   * proper interaction with the underlying content.
   */
  position: "relative",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
  marginTop: 0,
}));

function MainLayout({ title, children }: { title: string; children: any }) {
  const { open } = useSelector((state: RootState) => state.navBar);
  console.log(location);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        {/* Main content */}
        <Main
          open={open}
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme
              ? `rgba(${theme.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 3, md: 5 },
            }}
          >
            {/* <Header /> */}
            <AppNavBar title={title} />
            {/* <DrawerHeader /> */}
            <Main open={open}>{children}</Main>
          </Stack>
        </Main>
      </Box>
      {/* appbar */}
    </>
  );
}

export default MainLayout;
