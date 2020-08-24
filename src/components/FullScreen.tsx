import React, { useState } from "react";

import {
    isFullScreen as isFullScreenAPI,
    setFullScreen as setFullScreenAPI,
} from "src/scripts/FullscreenAPI";

import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";

export default function FullScreen(): JSX.Element {
    const [isFullScreen, setFullScreen] = useState(isFullScreenAPI());

    if (isFullScreen) {
        return (
            <FullscreenExitIcon
                id="fullscreen"
                color="primary"
                onClick={(): void => {
                    setFullScreenAPI(false, (err: any) => {
                        if (err) console.error(err);
                        else setFullScreen(false);
                    });
                }}
            />
        );
    } else {
        return (
            <FullscreenIcon
                id="fullscreen"
                color="primary"
                onClick={(): void => {
                    setFullScreenAPI(true, (err: any) => {
                        if (err) console.error(err);
                        else setFullScreen(true);
                    });
                }}
            />
        );
    }
}
