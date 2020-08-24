import React, { useState, useEffect } from "react";
import Game, { GAME_STATE } from "src/model/Game";
import StopWatch from "src/components/StopWatch";

import Typography from "@material-ui/core/Typography";
import SvgIcon from "@material-ui/core/SvgIcon";

interface Props {
    open: boolean;
    game: Game;
}

export default function InGameHUD({ open, game }: Props): JSX.Element {
    const [flag, setFlag] = useState(0);

    useEffect(() => {
        return game.on("statechange", ({ data: { newState } }): void => {
            if (newState === GAME_STATE.PLAYING)
                setFlag(game.getBoard().getMineCount());
        });
    }, []);

    useEffect(() => {
        return game.addEventListener("flagchange", (): void => {
            setFlag(game.getRemainingFlag());
        });
    }, []);

    if (open) {
        return (
            <>
                <div id="flag-count" className="HUD">
                    <SvgIcon color="primary" viewBox="0 0 256 256">
                        <path d="m83.50004,62.00006l15.8332,5.66655l1.33333,111.9999l13.66665,23.33331l-44.33329,0.66667l12.66666,-24.33331l0.83345,-117.33311l0,-0.00001z" />
                        <path
                            opacity="0.7"
                            d="m106.16669,70.00005l-0.16678,72.99982l90.99992,-35.99997l-90.83313,-36.99985l-0.00001,0z"
                        />
                    </SvgIcon>
                    <Typography color="primary">{flag}</Typography>
                </div>
                <div id="timer" className="HUD">
                    <StopWatch game={game} />
                </div>
            </>
        );
    } else {
        return null;
    }
}
