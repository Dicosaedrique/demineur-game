import React, { useState, useEffect } from "react";
import Game from "src/model/Game";
import { formatTime } from "src/scripts/utils";
import Typography from "@material-ui/core/Typography";

interface Props {
    game: Game;
}

export default function StopWatch({ game }: Props): JSX.Element {
    const [time, setTime] = useState(game.getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(game.getTime());
        }, 1000);
        return (): any => clearInterval(interval);
    }, []);

    return (
        <Typography component="p" color="primary">
            {formatTime(time)}
        </Typography>
    );
}
