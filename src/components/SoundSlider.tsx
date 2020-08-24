import React from "react";

import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";

interface Props {
    value: number;
    onChange: (value: number) => void;
}

export default function SoundSlider({ value, onChange }: Props): JSX.Element {
    return (
        <div className="slider-container">
            <Grid container spacing={2}>
                <Grid item>
                    <VolumeDown color="primary" />
                </Grid>
                <Grid item xs>
                    <Slider
                        min={0}
                        max={100}
                        value={value}
                        onChange={(_, newValue): void => {
                            if (
                                typeof newValue === "object" &&
                                "length" in newValue
                            )
                                newValue = newValue[0];

                            onChange(newValue);
                        }}
                        aria-labelledby="continuous-slider"
                    />
                </Grid>
                <Grid item>
                    <VolumeUp color="primary" />
                </Grid>
            </Grid>
        </div>
    );
}
