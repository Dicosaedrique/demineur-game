import React from "react";

import Menu from "src/components/Menu";
import FullScreen from "src/components/FullScreen";
import HUD from "src/components/HUD";
import ControlsSelector from "src/components/ControlsSelector";

import SettingsManager from "src/model/SettingsManager";
import Game, { GAME_STATE } from "src/model/Game";
import { WEBGL } from "src/scripts/WebGlChecker";

import { ListennerSupressor } from "src/model/Listenable";

import CustomCursor from "src/ressources/cursor.cur";

console.log(CustomCursor);

interface State {
    gameState: GAME_STATE;
}

const WEBGL_AVAILABLE = WEBGL.isWebGLAvailable();

export default class GameComponent extends React.Component<any, State> {
    private game: Game;
    private mount: HTMLElement;
    private clearGameStateEventListenner: ListennerSupressor;

    private settings: SettingsManager;

    constructor(props: any) {
        super(props);

        this.settings = SettingsManager.getInstance();

        this.game = new Game(
            this.settings.getDifficulty(),
            this.settings.getColorPreset()
        );

        this.state = {
            gameState: this.game.getState(),
        };
    }

    componentDidMount = (): void => {
        this.clearGameStateEventListenner = this.game.on(
            "statechange",
            ({ data: { newState } }): void => {
                this.setState({ gameState: newState });
            }
        );

        window.addEventListener("contextmenu", (evt): void => {
            evt.preventDefault();
        });

        this.game.getRenderer().attach(this.mount);
    };

    componentWillUnmount = (): void => {
        this.clearGameStateEventListenner();
    };

    render(): JSX.Element {
        if (WEBGL_AVAILABLE) {
            const { gameState } = this.state;

            return (
                <>
                    <Menu
                        open={gameState === GAME_STATE.MENU}
                        game={this.game}
                    />
                    <HUD
                        open={gameState === GAME_STATE.PLAYING}
                        game={this.game}
                    />
                    <div
                        ref={(ref): void => {
                            this.mount = ref;
                        }}
                    />
                    <ControlsSelector
                        open={gameState !== GAME_STATE.MENU}
                        game={this.game}
                    />
                    <FullScreen />
                </>
            );
        } else {
            return (
                <p>
                    WebGL n'est pas disponible sur votre navigateur ! Veuillez
                    réessayer sur un navigateur plus récent ! WebGL est utilisé
                    pour faire le rendu du jeu de démineur et est donc
                    nécéssaire pour fonctionner !
                </p>
            );
        }
    }
}
