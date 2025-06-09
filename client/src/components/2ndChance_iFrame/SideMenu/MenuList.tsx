import * as React from "react";
import { useNavigate } from "react-router-dom";
import apiService from "@/services/apiService";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { showToaster } from "@/redux/reducers/global/globalSlice";
import { useAppDispatch } from "@/redux/hook";
import { openNav } from '@/redux/reducers/navBarSlice';


const mainListItems = [
  {
    text: "Dashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
      <path d="M8 12.5V10.5" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.71318 2.38001L2.09318 6.08001C1.57318 6.49334 1.23985 7.36668 1.35318 8.02001L2.23985 13.3267C2.39985 14.2733 3.30652 15.04 4.26652 15.04H11.7332C12.6865 15.04 13.5999 14.2667 13.7599 13.3267L14.6465 8.02001C14.7532 7.36668 14.4199 6.49334 13.9065 6.08001L9.28652 2.38668C8.57318 1.81334 7.41985 1.81334 6.71318 2.38001Z" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>, path: "/2nd-chance/"
  },
  {
    text: "Raffle List", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
      <path d="M8 1.83334V6.50001L9.33333 5.16668" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.99984 6.49999L6.6665 5.16666" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.31982 9.16666H4.25982C4.51316 9.16666 4.73982 9.30666 4.85316 9.53332L5.63316 11.0933C5.85982 11.5467 6.31982 11.8333 6.82649 11.8333H9.17983C9.68649 11.8333 10.1465 11.5467 10.3732 11.0933L11.1532 9.53332C11.2665 9.30666 11.4998 9.16666 11.7465 9.16666H14.6532" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.66683 3.25333C2.30683 3.59999 1.3335 4.98666 1.3335 7.83333V10.5C1.3335 13.8333 2.66683 15.1667 6.00016 15.1667H10.0002C13.3335 15.1667 14.6668 13.8333 14.6668 10.5V7.83333C14.6668 4.98666 13.6935 3.59999 11.3335 3.25333" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>, path: "/2nd-chance/raffles"
  },
  {
    text: "Enter Your Ticket", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
      <path d="M14.4468 10.0333L14.1802 13.3667C14.0802 14.3867 14.0002 15.1667 12.1935 15.1667H3.80684C2.00017 15.1667 1.92017 14.3867 1.82017 13.3667L1.5535 10.0333C1.50017 9.48001 1.6735 8.96668 1.98684 8.57334C1.9935 8.56668 1.9935 8.56668 2.00017 8.56001C2.36684 8.11334 2.92017 7.83334 3.54017 7.83334H12.4602C13.0802 7.83334 13.6268 8.11334 13.9868 8.54668C13.9935 8.55334 14.0002 8.56001 14.0002 8.56668C14.3268 8.96001 14.5068 9.47334 14.4468 10.0333Z" stroke="#202020" strokeWidth="1.5" strokeMiterlimit="10" />
      <path d="M2.3335 8.12V4.68667C2.3335 2.42 2.90016 1.85333 5.16683 1.85333H6.0135C6.86016 1.85333 7.0535 2.10667 7.3735 2.53333L8.22016 3.66667C8.4335 3.94667 8.56016 4.12 9.12683 4.12H10.8268C13.0935 4.12 13.6602 4.68667 13.6602 6.95333V8.14667" stroke="#202020" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.28662 11.8333H9.71329" stroke="#202020" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>, path: "/scanner"
  },
  {
    text: "My Entries", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
      <path d="M8.24658 6.42001H11.7466" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.25342 6.42001L4.75342 6.92001L6.25342 5.42001" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.24658 11.0867H11.7466" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.25342 11.0867L4.75342 11.5867L6.25342 10.0867" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.00016 15.1667H10.0002C13.3335 15.1667 14.6668 13.8333 14.6668 10.5V6.50001C14.6668 3.16668 13.3335 1.83334 10.0002 1.83334H6.00016C2.66683 1.83334 1.3335 3.16668 1.3335 6.50001V10.5C1.3335 13.8333 2.66683 15.1667 6.00016 15.1667Z" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>, path: "/2nd-chance/my-entries"
  },
  {
    text: "Winners", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
      <path d="M12.0002 5.27333C11.9602 5.26666 11.9135 5.26666 11.8735 5.27333C10.9535 5.24 10.2202 4.48666 10.2202 3.55333C10.2202 2.6 10.9869 1.83333 11.9402 1.83333C12.8935 1.83333 13.6602 2.60666 13.6602 3.55333C13.6535 4.48666 12.9202 5.24 12.0002 5.27333Z" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.3135 10.1267C12.2268 10.28 13.2335 10.12 13.9401 9.64666C14.8801 9.01999 14.8801 7.99333 13.9401 7.36666C13.2268 6.89333 12.2068 6.73333 11.2935 6.89333" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.97983 5.27333C4.01983 5.26666 4.06649 5.26666 4.10649 5.27333C5.02649 5.24 5.75982 4.48666 5.75982 3.55333C5.75982 2.6 4.99316 1.83333 4.03983 1.83333C3.08649 1.83333 2.31982 2.60666 2.31982 3.55333C2.32649 4.48666 3.05983 5.24 3.97983 5.27333Z" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.66663 10.1267C3.75329 10.28 2.74663 10.12 2.03996 9.64666C1.09996 9.01999 1.09996 7.99333 2.03996 7.36666C2.75329 6.89333 3.77329 6.73333 4.68663 6.89333" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.00021 10.2533C7.96021 10.2467 7.91355 10.2467 7.87355 10.2533C6.95355 10.22 6.22021 9.46667 6.22021 8.53334C6.22021 7.58001 6.98688 6.81334 7.94021 6.81334C8.89355 6.81334 9.66021 7.58667 9.66021 8.53334C9.65355 9.46667 8.92021 10.2267 8.00021 10.2533Z" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.05998 12.3533C5.11998 12.98 5.11998 14.0067 6.05998 14.6333C7.12665 15.3467 8.87331 15.3467 9.93998 14.6333C10.88 14.0067 10.88 12.98 9.93998 12.3533C8.87998 11.6467 7.12665 11.6467 6.05998 12.3533Z" stroke="#202020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>, path: "/2nd-chance/winners"
  },
];


const secondaryListItems = [
  {
    text: "Logout", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
      <path d="M5.93311 5.54C6.13977 3.14 7.37311 2.16 10.0731 2.16H10.1598C13.1398 2.16 14.3331 3.35333 14.3331 6.33333V10.68C14.3331 13.66 13.1398 14.8533 10.1598 14.8533H10.0731C7.39311 14.8533 6.15977 13.8867 5.93977 11.5267" stroke="#F13E3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.0002 8.5H2.41357" stroke="#F13E3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.89984 6.26667L1.6665 8.5L3.89984 10.7333" stroke="#F13E3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>, path: 'logout'
  },
];

export default function MenuContent() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [selected, useSelected] = React.useState(0);
  const handleNavigation = (path: string, index: number) => {
    dispatch(openNav(false))
    useSelected(index);
    navigate(path);
  };

  const handleNavigation2 = async (path: string, index: number) => {
    useSelected(index);
    console.log(path)
    if (path === 'logout') {
      try {
        const res = await apiService.logout();
        if (res.data.result == "success") {
          window.parent.location.href = "https://18.138.76.86/member-area/"
        }
        dispatch(
          showToaster({
            message: "Logged out!",
            show: true,
            variant: "success",
            icon: null,
          })
        );
      } catch (err) {
        dispatch(
          showToaster({
            err,
            show: true,
            variant: "error",
            icon: null,
          })
        );
      }
    }

  };


  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List
        dense
        sx={{ gap: "5px", mt: 3 }}
      >
        {/* <ListSubheader component="div" sx={{
          fontSize: '16px',
          textTransform: 'uppercase',
          fontWeight: '600'
        }}>
          OVERVIEW
        </ListSubheader> */}
        {mainListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              display: "block",
              '& .Mui-selected': {
                color: '#702DFF',
                backgroundColor: 'transparent !important',
              }
            }}

          >
            <ListItemButton
              onClick={() => handleNavigation(item.path, index)}
              selected={index === selected}
              sx={{
                opacity: "1 !important",
                '&.Mui-selected .MuiTypography-root': {
                  color: '#702DFF !important',
                },
                '&.Mui-selected svg path': {
                  stroke: '#702DFF',
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ display: "block", }}
          >
            <ListItemButton sx={{
              opacity: "1 !important",
            }} onClick={() => handleNavigation2(item.path, index)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText sx={{
                '& .MuiTypography-root': {
                  color: item.path === 'logout' ? '#F13E3E !important' : 'initial'
                }
              }} primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
