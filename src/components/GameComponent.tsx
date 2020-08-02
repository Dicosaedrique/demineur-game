import React from "react";

import Game from "src/model/Game";
import { requestFullScreen } from "src/scripts/utils";

import logoFullScreen from "src/images/full_screen.png";
import withLocation from "src/components/WithLocation";

interface Props {
    location: any;
}

class GameComponent extends React.Component<Props, any> {
    game: Game;
    mount: HTMLElement;

    constructor(props: Props) {
        super(props);

        this.game = new Game({ width: 6, height: 5, mineDensity: 20 });

        if (this.props.location.state) {
            const { width, height, mineDensity } = this.props.location.state;

            if (width && height && mineDensity)
                this.game.setPreset({ width, height, mineDensity });
        }
    }

    componentDidMount = (): void => {
        this.game.getRenderer().attach(this.mount);
    };

    render(): JSX.Element {
        return (
            <div className="App">
                <div className="HUD">
                    <a
                        onClick={(): void => {
                            this.game.ready();
                        }}
                    >
                        Menu &gt; Ready (Start)
                    </a>
                </div>

                <div
                    ref={(ref): void => {
                        this.mount = ref;
                    }}
                />
                <div
                    id="fullscreen"
                    onClick={(): void => {
                        requestFullScreen();
                    }}
                >
                    <img src={logoFullScreen} draggable={false}></img>
                </div>
            </div>
        );
    }
}

export default withLocation(GameComponent);
