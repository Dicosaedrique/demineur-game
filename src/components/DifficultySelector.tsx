import React, { useState } from "react";

import Game from "src/model/Game";
import Br from "src/components/Br";

import {
    GAME_DIFFICULTY,
    DIFFICULTIES_LITTERAL,
    MIN_MINE_DENSITY,
    MAX_MINE_DENSITY,
} from "src/scripts/constants";

import { mapEnum } from "src/scripts/utils";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import SettingsManager from "src/model/SettingsManager";

import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import WarningIcon from "@material-ui/icons/Warning";

interface Props {
    game: Game;
}

export default function DifficultySelector({ game }: Props): JSX.Element {
    const [difficulty, setDifficulty] = useState(game.getDifficulty());
    const [width, setWidth] = useState(
        SettingsManager.getInstance().getUserPreset().width
    );

    const onChangeWidth = (evt: React.ChangeEvent<HTMLInputElement>): void => {
        const numberValue = Number(evt.target.value);

        if (!isNaN(numberValue) && numberValue > 0) {
            setWidth(numberValue);

            SettingsManager.getInstance().getUserPreset().width = numberValue;
            SettingsManager.getInstance().save();

            game.setDifficulty(GAME_DIFFICULTY.USER);
        }
    };

    const [height, setHeight] = useState(
        SettingsManager.getInstance().getUserPreset().height
    );

    const onChangeHeight = (evt: React.ChangeEvent<HTMLInputElement>): void => {
        const numberValue = Number(evt.target.value);

        if (!isNaN(numberValue) && numberValue > 0) {
            setHeight(numberValue);

            SettingsManager.getInstance().getUserPreset().height = numberValue;
            SettingsManager.getInstance().save();

            game.setDifficulty(GAME_DIFFICULTY.USER);
        }
    };

    const [mineDensity, setMineDensity] = useState(
        SettingsManager.getInstance().getUserPreset().mineDensity
    );

    return (
        <>
            <Typography variant="h3" color="primary">
                DIFFICULTÉ
            </Typography>
            <br />
            <ButtonGroup>
                {mapEnum<JSX.Element>(
                    GAME_DIFFICULTY,
                    (diff: GAME_DIFFICULTY) => (
                        <Button
                            size="large"
                            color="primary"
                            key={diff}
                            variant={
                                diff === difficulty ? "contained" : "outlined"
                            }
                            onClick={(): void => {
                                game.setDifficulty(diff);
                                setDifficulty(diff);
                            }}
                        >
                            {DIFFICULTIES_LITTERAL[diff]}
                        </Button>
                    )
                )}
            </ButtonGroup>
            {difficulty === GAME_DIFFICULTY.USER && (
                <div>
                    <Br count={2} />
                    <TextField
                        id="outlined-secondary"
                        variant="outlined"
                        color="primary"
                        label="Largeur"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={width}
                        onChange={onChangeWidth}
                    />
                    <Br count={2} />
                    <TextField
                        id="outlined-secondary"
                        variant="outlined"
                        color="primary"
                        label="Hauteur"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={height}
                        onChange={onChangeHeight}
                    />
                    <Br count={2} />
                    <Typography variant="h5" color="primary">
                        Difficulté (densité de mine)
                    </Typography>
                    <div className="slider-container">
                        <Grid container spacing={2}>
                            <Grid item>
                                <EmojiEmotionsIcon color="primary" />
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    min={MIN_MINE_DENSITY}
                                    max={MAX_MINE_DENSITY}
                                    value={mineDensity}
                                    onChange={(_, newValue): void => {
                                        if (
                                            typeof newValue === "object" &&
                                            "length" in newValue
                                        )
                                            newValue = newValue[0];

                                        setMineDensity(newValue);

                                        SettingsManager.getInstance().getUserPreset().mineDensity = newValue;
                                        SettingsManager.getInstance().save();

                                        game.setDifficulty(
                                            GAME_DIFFICULTY.USER
                                        );
                                    }}
                                    aria-labelledby="continuous-slider"
                                />
                            </Grid>
                            <Grid item>
                                <WarningIcon color="primary" />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            )}
        </>
    );
}
