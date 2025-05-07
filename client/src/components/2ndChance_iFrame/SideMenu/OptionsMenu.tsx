import * as React from 'react';
import { styled } from '@mui/material/styles';
import { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';

import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from '@/components/MenuButton';
import { useNavigate } from 'react-router-dom';

const MenuItem = styled(MuiMenuItem)({
    margin: '2px 0',
});

export default function OptionsMenu() {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleNavigation = (path: string) => {
        setAnchorEl(null);
        navigate(path);
    };
    return (
        <React.Fragment>
            <MenuButton
                aria-label="Open menu"
                onClick={handleClick}
                sx={{ borderColor: 'transparent' }}
            >
                <MoreVertRoundedIcon />
            </MenuButton>
            <Menu
                anchorEl={anchorEl}
                id="menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={{
                    [`& .${listClasses.root}`]: {
                        padding: '4px',
                    },
                    [`& .${paperClasses.root}`]: {
                        padding: 0,
                    },
                    [`& .${dividerClasses.root}`]: {
                        margin: '4px -4px',
                    },
                }}
            >
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                <MenuItem onClick={() => handleNavigation('/iframe/2nd-chance/user-profile')}>My account</MenuItem>
                {/* <Divider />
                <MenuItem onClick={handleClose}>Add another account</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem> */}
                {/* <Divider />
                <MenuItem
                    onClick={handleClose}
                    sx={{
                        [`& .${listItemIconClasses.root}`]: {
                            ml: 'auto',
                            minWidth: 70,
                        },
                    }}
                >
                    <ListItemText>Logout</ListItemText>
                    <ListItemIcon>
                        <LogoutRoundedIcon fontSize="small" />
                    </ListItemIcon>
                </MenuItem> */}
            </Menu>
        </React.Fragment>
    );
}
