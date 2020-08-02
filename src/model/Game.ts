import { Board, Cell, Listenable, GameRenderer } from "src/model";
import { DIFFICULTY, GAME_PRESETS } from "src/scripts/constants";

enum GAME_STATE {
    MENU = "MENU",
    READY = "READY",
    PLAYING = "PLAYING",
    VICTORY = "VICTORY",
    DEFEAT = "DEFEAT",
}

enum GAME_INPUT {
    LEFT_CLICK = 0,
    MIDDLE_CLICK = 1,
    RIGHT_CLICK = 2,
}

interface Preset {
    width: number;
    height: number;
    mineDensity: number;
}

export default class Game extends Listenable {
    static GAME_STATE = GAME_STATE;
    static GAME_INPUT = GAME_INPUT;

    private renderer: GameRenderer;
    private preset: Preset = GAME_PRESETS[DIFFICULTY.MEDIUM];
    private board: Board;
    private state: GAME_STATE;
    private flagCount: number;
    private startingTime: number;

    constructor(preset?: Preset) {
        super();

        this.renderer = new GameRenderer(this);

        if (preset) this.setPreset(preset);
        else this.setPreset(this.preset);

        this.menu();
    }

    private initBoard = (): void => {
        this.board = new Board(
            this.preset.width,
            this.preset.height,
            this.preset.mineDensity
        );

        this.renderer.initBoard();
    };

    getState = (): GAME_STATE => this.state;

    getRenderer = (): GameRenderer => this.renderer;

    getBoard = (): Board => this.board;

    getTime = (): number => {
        return this.startingTime !== null ? Date.now() - this.startingTime : 0;
    };

    private reset = (): void => {
        this.startingTime = null;
        this.flagCount = 0;
        this.board.reset();
    };

    setPreset = (preset: Preset): void => {
        this.preset = preset;
        this.initBoard();
        this.reset();
    };

    click = (cell: Cell, inputType: GAME_INPUT): number[] => {
        let res: number[] = [];
        if (
            this.state === GAME_STATE.READY ||
            this.state === GAME_STATE.PLAYING
        ) {
            if (inputType === GAME_INPUT.LEFT_CLICK) {
                if (cell.isHidden()) {
                    if (!cell.isFlag() && !cell.isDoubt()) {
                        if (this.state === GAME_STATE.READY) {
                            res = this.start(cell);
                        } else {
                            if (cell.getValue() === Cell.CELL_VALUES.MINE) {
                                cell.reveal();
                                this.setState(GAME_STATE.DEFEAT);
                                res = [cell.getId()];
                            } else {
                                res = this.board.reveal(cell);
                            }
                        }
                    }
                }
            } else if (inputType === GAME_INPUT.RIGHT_CLICK) {
                if (cell.isHidden()) {
                    cell.setFlag(!cell.isFlag());
                    if (cell.isFlag()) this.flagCount++;
                    else this.flagCount--;
                    res = [cell.getId()];
                }
            } else if (inputType === GAME_INPUT.MIDDLE_CLICK) {
                if (cell.isHidden()) {
                    cell.setDoubt(!cell.isDoubt());
                    res = [cell.getId()];
                }
            }

            if (this.isGameWon()) {
                this.setState(GAME_STATE.VICTORY);
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
            newState: newState,
            oldState: this.state,
        });
        this.state = newState;
    };

    menu = (): void => {
        this.reset();
        this.setState(GAME_STATE.MENU);
    };

    ready = (): void => {
        this.setState(GAME_STATE.READY);
    };

    start = (cell?: Cell): number[] => {
        this.startingTime = Date.now();
        this.setState(GAME_STATE.PLAYING);
        return this.board.init(cell);
    };
}
