import React, { useState } from "react";

import Game from "src/model/Game";
import { withThemeSetter } from "src/components/ThemeManager";

import { COLOR_PRESETS, GAME_COLOR } from "src/scripts/constants";

import { mapEnum } from "src/scripts/utils";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";

interface Props {
    game: Game;
    setThemeColor: (color: string) => void;
}

function ColorSelector({ game, setThemeColor }: Props): JSX.Element {
    const [color, setColor] = useState(game.getColor());

    return (
        <>
            <Typography variant="h3" color="primary">
                COULEURS
            </Typography>
            <br />
            <ButtonGroup>
                {mapEnum<JSX.Element>(GAME_COLOR, (colorMap: GAME_COLOR) => (
                    <Button
                        size="large"
                        color="primary"
                        key={colorMap}
                        variant={colorMap === color ? "contained" : "outlined"}
                        onClick={(): void => {
                            game.setColor(colorMap);
                            setColor(colorMap);
                            setThemeColor(COLOR_PRESETS[colorMap].hexa);
                        }}
                    >
                        {COLOR_PRESETS[colorMap].displayName}
                    </Button>
                ))}
            </ButtonGroup>
        </>
    );
}

export default withThemeSetter(ColorSelector);
