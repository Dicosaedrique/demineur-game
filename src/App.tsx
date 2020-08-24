import React from "react";

import ThemeManager from "src/components/ThemeManager";
import GamePage from "src/pages/GamePage";

import "src/styles/App.css";

import SettingsManager from "src/model/SettingsManager";
import { COLOR_PRESETS } from "src/scripts/constants";

interface State {
    start: boolean;
}

export default function App(): JSX.Element {
    return (
        <ThemeManager
            defaultThemeColor={
                COLOR_PRESETS[SettingsManager.getInstance().getColorPreset()]
                    .hexa
            }
        >
            <GamePage />
        </ThemeManager>
    );
}
