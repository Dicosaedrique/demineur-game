import React, { useState } from "react";

import SoundSlider from "src/components/SoundSlider";
import Br from "src/components/Br";
import Game from "src/model/Game";
import Settings from "src/model/SettingsManager";

import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

interface Props {
    game: Game;
}

export default function Options({ game }: Props): JSX.Element {
    const [globalMute, setGlobalMute] = useState(
        Settings.getInstance().getGlobalMute()
    );
    const [soundTracksVolume, setSoundTracksVolume] = useState(
        Math.floor(Settings.getInstance().getSoundTrackVolume() * 100)
    );
    const [fxsVolume, setFxsVolume] = useState(
        Math.floor(Settings.getInstance().getFxsVolume() * 100)
    );

    return (
        <>
            <Typography variant="h4" color="primary">
                OPTIONS
            </Typography>
            <br />
            <FormControlLabel
                label="Activer les sons"
                control={
                    <Checkbox
                        checked={!globalMute}
                        onChange={(): void => {
                            game.mute(!globalMute);
                            setGlobalMute(!globalMute);
                        }}
                        name="Activer les sons"
                        color="primary"
                    />
                }
            />

            <Br count={3} />
            <Typography variant="h5" color="primary">
                Volume des musiques
            </Typography>

            <SoundSlider
                value={soundTracksVolume}
                onChange={(volume): void => {
                    setSoundTracksVolume(volume);
                    game.setSoundTracksVolume(volume / 100);
                }}
            />

            <Br count={3} />
            <Typography variant="h5" color="primary">
                Volume des effets sonores
            </Typography>

            <SoundSlider
                value={fxsVolume}
                onChange={(volume): void => {
                    setFxsVolume(volume);
                    game.setFXsVolume(volume / 100);
                }}
            />
        </>
    );
}
