import * as React from "react";
import { useNavigate } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import {
  HomeRounded,
  Image,
  PeopleOutline,
  QrCodeScanner,
  Attractions,
  ListAlt,
  DisplaySettings,
  Group,
  SettingsRounded
} from '@mui/icons-material';

const mainListItems = [
  { text: "Home", icon: <HomeRounded />, path: "/dashboard" },
  { text: "Images", icon: <Image />, path: "/images" },
  { text: "Administrator", icon: <Group />, path: "/administrator" },
  { text: "Customer", icon: <PeopleOutline />, path: "/customer" },
  {
    text: "Game Maintenance",
    icon: <DisplaySettings />,
    path: "/game-maintenance",
  },
  { text: "Prize List", icon: <ListAlt />, path: "/prize-list" },
  { text: "Raffle Draw", icon: <Attractions />, path: "/raffle-draw" },
  { text: "Ticket Scanned", icon: <QrCodeScanner />, path: "/scan" },
  // { text: "My Ticket Scan", icon: <QrCodeScanner />, path: "/myScan" },
];

const secondaryListItems = [
  { text: "System Defaults", icon: <SettingsRounded /> },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const [selected, useSelected] = React.useState(0);
  const handleNavigation = (path: string, index: number) => {
    useSelected(index);
    navigate(path);
  };
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List
        dense
        sx={{ gap: "5px" }}
      >
        {mainListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ display: "block" }}
          >
            <ListItemButton
              onClick={() => handleNavigation(item.path, index)}
              selected={index === selected}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
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
            sx={{ display: "block" }}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
