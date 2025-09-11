//@ts-nocheck
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
  SettingsRounded,
  WbAuto,
  EmojiEventsOutlined,
  LocalActivityOutlined,
} from "@mui/icons-material";
import { useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";

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
  { text: "Alpha Code", icon: <WbAuto />, path: "/alphaCode" },
  { text: "Winners", icon: <EmojiEventsOutlined />, path: "/Winners" },
  {
    text: "Free tickets",
    icon: <LocalActivityOutlined />,
    path: "/freeTicket",
  },
  // { text: "My Ticket Scan", icon: <QrCodeScanner />, path: "/myScan" },
];

const secondaryListItems = [
  { text: "SC Site Defaults", icon: <SettingsRounded /> },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const [selected, useSelected] = React.useState(0);
  const handleNavigation = (path: string, index: number) => {
    useSelected(index);
    navigate(path);
  };
  const { myPermission } = useAppSelector((state: RootState) => state.userType);
  const [newRoutes, setNewRoutes] = React.useState(null);
  React.useEffect(() => {
    if (myPermission) {
      let a = mainListItems.map((v) => {
        let removeForwardSlash = v.path.replace("/", "");
        let changeUnderScore = removeForwardSlash
          .replace("-", "_")
          .toLowerCase();
        let getPermission = myPermission[changeUnderScore];
        if (getPermission) {
          return { ...v, view: getPermission.view };
        } else {
          return { ...v, view: true };
        }
      });
      setNewRoutes(a);
    }
    console.log(newRoutes);
  }, [myPermission]);
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List
        dense
        sx={{ gap: "5px" }}
      >
        {newRoutes
          .filter(({ view }) => view)
          .map((item, index) => (
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
