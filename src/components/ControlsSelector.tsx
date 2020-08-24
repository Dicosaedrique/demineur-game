import React, { useState } from "react";
import Game from "src/model/Game";

import { CONTROLS_TYPE } from "src/scripts/constants";

import CachedIcon from "@material-ui/icons/Cached";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";

interface Props {
    open: boolean;
    game: Game;
}

export default function ControlsSelector({ open, game }: Props): JSX.Element {
    const [controls, setControls] = useState(game.getControls());

    if (open) {
        if (controls === CONTROLS_TYPE.SPHERE) {
            return (
                <ControlCameraIcon
                    id="controls"
                    color="primary"
                    onClick={(): void => {
                        setControls(CONTROLS_TYPE.PANNING);
                        game.setControls(CONTROLS_TYPE.PANNING);
                    }}
                />
            );
        } else if (controls === CONTROLS_TYPE.PANNING) {
            return (
                <CachedIcon
                    id="controls"
                    color="primary"
                    onClick={(): void => {
                        setControls(CONTROLS_TYPE.SPHERE);
                        game.setControls(CONTROLS_TYPE.SPHERE);
                    }}
                />
            );
        } else return null;
    } else return null;
}
