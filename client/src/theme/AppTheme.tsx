import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs';
import { navigationCustomizations } from './customizations/navigation';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { dataGridCustomizations } from './customizations/dataGrid';
import { surfacesCustomizations } from './customizations/surfaces';
import { dialogCustomizations } from './customizations/dialog';

import { colorSchemes, typography, shadows, shape } from './themePrimitives';


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
                cssVariables: {
                    colorSchemeSelector: 'data-mui-color-scheme',
                    cssVarPrefix: 'template',
                },
                colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
                typography,
                shadows,
                shape,
                components: {
                    ...inputsCustomizations,
                    ...dataDisplayCustomizations,
                    ...dataGridCustomizations,
                    ...navigationCustomizations,
                    ...surfacesCustomizations,
                    ...dialogCustomizations,
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
