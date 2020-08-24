import Board, { BoardConfig } from "src/model/Board";
import Cell from "src/model/Cell";
import GameRenderer from "src/model/GameRenderer";
import SoundManager from "src/model/SoundManager";
import Listenable from "src/model/Listenable";
import SettingsManager from "src/model/SettingsManager";

import {
    GAME_DIFFICULTY,
    GAME_COLOR,
    GAME_PRESETS,
    COLOR_PRESETS,
    CONTROLS_TYPE,
} from "src/scripts/constants";

export enum GAME_STATE {
    MENU = "MENU",
    READY = "READY",
    PLAYING = "PLAYING",
    VICTORY = "VICTORY",
    DEFEAT = "DEFEAT",
}

export enum GAME_INPUT {
    LEFT_CLICK = 0,
    MIDDLE_CLICK = 1,
    RIGHT_CLICK = 2,
}

export default class Game extends Listenable {
    private difficulty: GAME_DIFFICULTY;
    private color: GAME_COLOR;
    private controls: CONTROLS_TYPE;

    private renderer: GameRenderer;
    private soundManager: SoundManager;
    private board: Board;
    private state: GAME_STATE;
    private flagCount: number;
    private startingTime: number;

    private settings: SettingsManager;

    constructor(
        difficulty: GAME_DIFFICULTY = GAME_DIFFICULTY.MEDIUM,
        color: GAME_COLOR = GAME_COLOR.BLEU
    ) {
        super();

        this.settings = SettingsManager.getInstance();

        this.soundManager = new SoundManager();

        this.renderer = new GameRenderer(this);

        this.setDifficulty(difficulty);
        this.setColor(color);

        this.setControls(this.settings.getControls());

        this.menu();
    }

    // GETTERS

    getDifficulty = (): GAME_DIFFICULTY => this.difficulty;
    getColor = (): GAME_COLOR => this.color;
    getControls = (): CONTROLS_TYPE => this.controls;
    getState = (): GAME_STATE => this.state;
    getRenderer = (): GameRenderer => this.renderer;
    getSoundManager = (): SoundManager => this.soundManager;
    getBoard = (): Board => this.board;
    getFlagCount = (): number => this.flagCount;
    getTime = (): number => {
        return this.startingTime !== null ? Date.now() - this.startingTime : 0;
    };
    getRemainingFlag = (): number =>
        Math.max(0, this.getBoard().getMineCount() - this.flagCount);

    // SETTERS

    setDifficulty = (difficulty: GAME_DIFFICULTY): void => {
        this.difficulty = difficulty;
        this.settings.setDifficulty(difficulty);

        let newBoardConfig: BoardConfig;

        if (this.difficulty === GAME_DIFFICULTY.USER) {
            const {
                width,
                height,
                mineDensity,
            } = this.settings.getUserPreset();

            if (width && height && mineDensity) {
                newBoardConfig = new BoardConfig(width, height, mineDensity);
            }
        } else {
            newBoardConfig = GAME_PRESETS[this.difficulty];
        }

        this.board = new Board(newBoardConfig);

        this.renderer.initBoard();

        this.reset();
    };

    setColor = (color: GAME_COLOR): void => {
        this.color = color;
        this.settings.setColorPreset(color);
        this.renderer.setColor(COLOR_PRESETS[this.color].code);
    };

    setControls = (controls: CONTROLS_TYPE): void => {
        this.controls = controls;
        this.renderer.resetContols();
        this.settings.setControls(this.controls);
    };

    // METHODS

    private reset = (): void => {
        this.startingTime = null;
        this.flagCount = 0;
        this.board.reset();
    };

    click = (cellIndice: number, inputType: GAME_INPUT): number[] => {
        let res: number[] = [];
        if (
            (this.state === GAME_STATE.READY ||
                this.state === GAME_STATE.PLAYING) &&
            this.board.isCell(cellIndice)
        ) {
            const cell = this.board.getCell(cellIndice);
            if (inputType === GAME_INPUT.LEFT_CLICK) {
                if (cell.isHidden()) {
                    this.soundManager.click();
                    if (!cell.isFlag() && !cell.isDoubt()) {
                        if (this.state === GAME_STATE.READY) {
                            res = this.start(cellIndice);
                        } else {
                            if (cell.getValue() === Cell.CELL_VALUES.MINE) {
                                cell.reveal();
                                this.lose();
                                res = [cell.getIndice()];
                            } else {
                                res = this.board.reveal(cellIndice);
                            }
                        }
                    }
                }
            } else if (inputType === GAME_INPUT.RIGHT_CLICK) {
                if (cell.isHidden()) {
                    this.soundManager.flag();
                    cell.setFlag(!cell.isFlag());
                    if (cell.isFlag()) this.flagCount++;
                    else this.flagCount--;

                    this.emmitEvent({
                        type: "flagchange",
                        data: {
                            flagCount: this.flagCount,
                        },
                    });

                    res = [cell.getIndice()];
                }
            } else if (inputType === GAME_INPUT.MIDDLE_CLICK) {
                if (cell.isHidden()) {
                    this.soundManager.flag();
                    cell.setDoubt(!cell.isDoubt());
                    res = [cell.getIndice()];
                }
            }

            if (this.isGameWon()) {
                this.win();
            }
        }

        return res;
    };

    private isGameWon = (): boolean => {
        if (this.state !== GAME_STATE.PLAYING) return false;

        for (const cell of this.board.getCells()) {
            if (cell.isHidden() && cell.getValue() !== Cell.CELL_VALUES.MINE)
                return false;
        }

        return true;
    };

    setState = (newState: GAME_STATE): void => {
        this.emmitEvent({
            type: "statechange",
            data: {
                newState: newState,
                oldState: this.state,
            },
        });
        this.state = newState;
    };

    menu = (): void => {
        this.reset();
        this.soundManager.menu();
        this.setState(GAME_STATE.MENU);
    };

    ready = (): void => {
        this.soundManager.start();
        this.setState(GAME_STATE.READY);
    };

    start = (cellIndice?: number): number[] => {
        this.startingTime = Date.now();
        const res = this.board.init(cellIndice);
        this.setState(GAME_STATE.PLAYING);
        return res;
    };

    win = (): void => {
        this.soundManager.win();
        this.setState(GAME_STATE.VICTORY);
    };

    lose = (): void => {
        this.soundManager.lose();
        this.setState(GAME_STATE.DEFEAT);
    };

    mute = (mute: boolean): void => {
        this.soundManager.mute(mute);
    };

    setSoundTracksVolume = (volume: number): void => {
        this.soundManager.setSoundTracksVolume(volume);
    };

    setFXsVolume = (volume: number): void => {
        this.soundManager.setFXsVolume(volume);
    };
}
