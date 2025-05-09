//@ts-nocheck

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: theme.palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

export default function Header() {
    return (
        <Stack
            direction="row"
            sx={{
                display: { xs: 'none', md: 'flex' },
                width: '100%',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                maxWidth: { sm: '100%', md: '1700px' },
                pt: 1.5,
            }}
            spacing={2}
        >
            <StyledBreadcrumbs
                aria-label="breadcrumb"
            >
                {/* <Typography variant="body1">Dashboard</Typography> */}
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Home
                </Typography>
            </StyledBreadcrumbs>

        </Stack>
    );
}
