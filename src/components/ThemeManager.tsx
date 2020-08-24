import React, { useState } from "react";

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createPrimaryTheme } from "src/scripts/utils";

const ThemeSetter = React.createContext(null);

interface Props {
    defaultThemeColor: string;
    children: React.ReactNode;
}

export default function ThemeManager({
    defaultThemeColor,
    children,
}: Props): JSX.Element {
    const [themeColor, setThemeColor] = useState(defaultThemeColor);

    return (
        <ThemeSetter.Provider value={setThemeColor}>
            <ThemeProvider theme={createPrimaryTheme(themeColor)}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeSetter.Provider>
    );
}

export const withThemeSetter = (Component: React.ElementType) => (
    props: any
): JSX.Element => (
    <ThemeSetter.Consumer>
        {(setThemeColor): JSX.Element => (
            <Component {...props} setThemeColor={setThemeColor} />
        )}
    </ThemeSetter.Consumer>
);
