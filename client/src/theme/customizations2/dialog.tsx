import { Theme, Components } from '@mui/material/styles';

/* eslint-disable import/prefer-default-export */
export const dialogCustomizations: Components<Theme> = {
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                borderBottom: "1px solid hsla(220, 20%, 80%, 0.4)",
            },
        },
    },
    MuiDialogContent: {
        styleOverrides: {
            root: {
                padding: '20px !important',
            },
        },
    },
    // MuiFormControl: {
    //     styleOverrides: {
    //         root: {
    //             width: "100%",
    //         },
    //     },
    // },
};
