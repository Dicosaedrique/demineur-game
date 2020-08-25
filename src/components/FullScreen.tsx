import React from "react";

import {
    isFullScreen as isFullScreenAPI,
    setFullScreen as setFullScreenAPI,
} from "src/scripts/FullscreenAPI";

import FullscreenIcon from "@material-ui/icons/Fullscreen";

export default function FullScreen(): JSX.Element {
    return (
        <FullscreenIcon
            id="fullscreen"
            color="primary"
            onClick={(): void => {
                setFullScreenAPI(!isFullScreenAPI());
            }}
        />
    );
}
