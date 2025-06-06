//@ts-nocheck
import * as React from "react";
import { styled } from "@mui/material/styles";
import Divider, { dividerClasses } from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuButton from "@/components/MenuButton";
import { showToaster } from "@/redux/reducers/global/globalSlice";
import { useAppDispatch } from "@/redux/hook";
import apiService from "@/services/apiService";
import { useNavigate } from "react-router-dom";
import { userLogout } from "@/redux/reducers/token/asyncCalls";

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
});

export default function OptionsMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      dispatch(userLogout());
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
          variant: "success",
          icon: null,
        })
      );
    }
    // try {
    //     const res = await apiService.logout();
    //     if (res.data.result == "success") {
    //         // navigate("/sign-in")
    //     }
    //     dispatch(
    //         showToaster({
    //             message: "Logged out!",
    //             show: true,
    //             variant: "success",
    //             icon: null,
    //         })
    //     );
    // } catch (err) {
    //     dispatch(
    //         showToaster({
    //             err,
    //             show: true,
    //             variant: "error",
    //             icon: null,
    //         })
    //     );
    // }
  };
  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "4px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px -4px",
          },
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
        {/* <Divider />
                <MenuItem onClick={handleClose}>Add another account</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem> */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 70,
            },
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon sx={{
              color: 'rgb(241, 62, 62)'
            }} fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{
            color: 'rgb(241, 62, 62)'
          }}>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
