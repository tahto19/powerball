import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs';


interface AppThemeProps {
    children: React.ReactNode;
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions['components'];
}

export default function AppTheme({
    children,
    disableCustomTheme = false,
    themeComponents = {},
}: AppThemeProps) {
    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                components: {
                    ...inputsCustomizations,
                    ...themeComponents,
                },
            });
    }, [disableCustomTheme, themeComponents]);

    if (disableCustomTheme) {
        return <>{children}</>;
    }

    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}
