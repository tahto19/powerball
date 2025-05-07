//@ts-nocheck
import {
  Avatar,
  Box,
  Button,
  Grid2,
  Paper,
  Stack,
  SvgIcon,
} from "@mui/material";
import logo from "../../../assets/image/logo.png";
import BtnIcon from "../../../assets/svg/btnIcon.tsx";
import { NotificationsNoneOutlined } from "@mui/icons-material";

const MyEntriesMain = () => {
  return (
    <Grid2
      container
      spacing={1}
      sx={{ padding: "1rem" }}
    >
      <Grid2 size={{ md: 12, lg: 12, xs: 12 }}>
        <Paper elevation={1}>
          <Stack
            direction="row"
            sx={{ padding: "1rem" }}
          >
            <Box sx={{ width: "15%", alignSelf: "center" }}>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  background: "#202020",
                  borderRadius: "25px",
                  textTransform: "none ",
                }}
                endIcon={<BtnIcon />}
              >
                Enter Ticket
              </Button>
            </Box>
            <Box sx={{ textAlign: "center", width: "85%" }}>
              <img
                srcSet={logo}
                src={logo}
                alt="logo"
                loading="lazy"
                style={{ width: "30%" }}
              />
            </Box>
          </Stack>
        </Paper>
      </Grid2>
      <Grid2 size={{ md: 12, lg: 12, xs: 12 }}>
        <Stack
          direction="row"
          spacing={3}
          sx={{
            justifyContent: "center",
            alignItems: "stretch",
            textAlign: "center",
          }}
        >
          <Button
            startIcon={
              <Avatar sx={{ backgroundColor: "#F26A2133" }}>
                <NotificationsNoneOutlined
                  fontSize="small"
                  sx={{ fontColor: "#702DFF", color: "#702DFF" }}
                />
              </Avatar>
            }
            variant="contained"
            sx={{
              width: "49%",
              padding: ".7rem",
              textAlign: "center",
              textTransform: "none ",
              background: "white",
              color: "black",
            }}
          >
            My Entries
          </Button>
          <Button
            startIcon={
              <Avatar sx={{ backgroundColor: "#F26A2133" }}>
                <NotificationsNoneOutlined
                  fontSize="small"
                  sx={{ fontColor: "#702DFF", color: "#702DFF" }}
                />
              </Avatar>
            }
            variant="contained"
            sx={{
              width: "49%",
              padding: ".7rem",
              textAlign: "center",
              textTransform: "none ",
              background: "white",
              color: "black",
            }}
          >
            Winners
          </Button>
          <Button
            startIcon={
              <Avatar sx={{ backgroundColor: "#F26A2133" }}>
                <NotificationsNoneOutlined
                  fontSize="small"
                  sx={{ fontColor: "#702DFF", color: "#702DFF" }}
                />
              </Avatar>
            }
            variant="contained"
            sx={{
              width: "49%",
              padding: ".7rem",
              textAlign: "center",
              textTransform: "none ",
              background: "white",
              color: "black",
            }}
          >
            ETC
          </Button>
        </Stack>
      </Grid2>
      <Grid2></Grid2>
    </Grid2>
  );
};

export default MyEntriesMain;
