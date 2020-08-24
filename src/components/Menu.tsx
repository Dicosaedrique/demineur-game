import React from "react";

import DifficultySelector from "src/components/DifficultySelector";
import ColorSelector from "src/components/ColorSelector";
import Options from "src/components/Options";
import Br from "src/components/Br";
import Credits from "src/components/Credits";
import Game from "src/model/Game";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

interface Props {
    game: Game;
    open: boolean;
}

export default function MenuComponent({ open, game }: Props): JSX.Element {
    if (open) {
        return (
            <>
                <div className="overlay"></div>
                <div id="menu" className="HUD noselect">
                    <Typography variant="h1" color="primary">
                        DÉMINEUR 3D
                    </Typography>

                    <Br count={2} />

                    <Button
                        id="play-button"
                        color="primary"
                        variant="contained"
                        onClick={(): void => {
                            game.ready();
                        }}
                    >
                        Jouer
                    </Button>

                    <Br count={4} />

                    <DifficultySelector game={game} />

                    <Br count={3} />

                    <ColorSelector game={game} />

                    <Br count={3} />

                    <Options game={game} />

                    <Br count={4} />

                    <Credits />

                    <Br count={7} />
                </div>
            </>
        );
    } else {
        return null;
    }
}
