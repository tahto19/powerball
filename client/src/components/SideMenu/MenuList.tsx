import * as React from "react";
import { useNavigate } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import GroupIcon from "@mui/icons-material/Group";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AttractionsIcon from "@mui/icons-material/Attractions";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, path: "/dashboard" },
  { text: "Administrator", icon: <GroupIcon />, path: "/administrator" },
  { text: "Costumer", icon: <PeopleOutlineIcon />, path: "/scan" },
  {
    text: "Game Maintenance",
    icon: <DisplaySettingsIcon />,
    path: "/game-maintenance",
  },
  { text: "Prize List", icon: <ListAltIcon />, path: "/prize-list" },
  { text: "Raffle Draw", icon: <AttractionsIcon />, path: "/dashboard" },
  { text: "Ticket Scan", icon: <QrCodeScannerIcon />, path: "/scan" },
];

const secondaryListItems = [
  { text: "System Defaults", icon: <SettingsRoundedIcon /> },
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
