import { Board } from "src/model";
import { Object3D } from "three";

enum CELL_VALUES {
    BLANK = 0,
    MINE = -1,
}

enum ARROUND {
    TOP_LEFT = 0,
    TOP = 1,
    TOP_RIGHT = 2,
    LEFT = 3,
    RIGHT = 4,
    BOTTOM_LEFT = 5,
    BOTTOM = 6,
    BOTTOM_RIGHT = 7,
}

export enum RENDER_STATE {
    HIDDEN = "HIDDEN",
    FLAG = "FLAG",
    DOUBT = "DOUBT",
    REVEALED_0 = "REVEALED_0",
    REVEALED_1 = "REVEALED_1",
    REVEALED_2 = "REVEALED_2",
    REVEALED_3 = "REVEALED_3",
    REVEALED_4 = "REVEALED_4",
    REVEALED_5 = "REVEALED_5",
    REVEALED_6 = "REVEALED_6",
    REVEALED_7 = "REVEALED_7",
    REVEALED_8 = "REVEALED_8",
    REVEALED_MINE = "REVEALED_MINE",
}

export default class Cell {
    static CELL_VALUES = CELL_VALUES;
    static ARROUND = ARROUND;

    private hidden = true;
    private board: Board;
    private id: number;
    private pos: Vector2D;
    private value: number = CELL_VALUES.BLANK;
    private flag = false;
    private doubt = false;
    private state: RENDER_STATE = RENDER_STATE.HIDDEN;

    constructor(id: number, pos: Vector2D, boardRef: Board) {
        this.id = id;
        this.pos = pos;
        this.board = boardRef;
    }

    getId = (): number => this.id;

    getPos = (): Vector2D => this.pos;

    isHidden = (): boolean => this.hidden;

    isFlag = (): boolean => this.flag;

    isDoubt = (): boolean => this.doubt;

    getState = (): RENDER_STATE => this.state;

    setMine = (): void => this.setValue(CELL_VALUES.MINE);

    isMine = (): boolean => this.value === CELL_VALUES.MINE;

    setValue = (newValue: number): void => {
        this.value = newValue;
        this.updateRenderState();
    };

    getValue = (): number => this.value;

    private updateRenderState = (): void => {
        if (this.flag) {
            this.state = RENDER_STATE.FLAG;
        } else if (this.doubt) {
            this.state = RENDER_STATE.DOUBT;
        } else if (this.hidden) {
            this.state = RENDER_STATE.HIDDEN;
        } else {
            if (this.isMine()) this.state = RENDER_STATE.REVEALED_MINE;
            else
                this.state =
                    RENDER_STATE[`REVEALED_${this.value}` as RENDER_STATE];
        }
    };

    getCellsArround = (): Cell[] => {
        const indices: number[] = Array(8);

        indices[ARROUND.TOP_LEFT] = this.board.posToIndex({
            x: this.pos.x - 1,
            y: this.pos.y - 1,
        });

        indices[ARROUND.TOP] = this.board.posToIndex({
            x: this.pos.x,
            y: this.pos.y - 1,
        });

        indices[ARROUND.TOP_RIGHT] = this.board.posToIndex({
            x: this.pos.x + 1,
            y: this.pos.y - 1,
        });

        indices[ARROUND.LEFT] = this.board.posToIndex({
            x: this.pos.x - 1,
            y: this.pos.y,
        });

        indices[ARROUND.RIGHT] = this.board.posToIndex({
            x: this.pos.x + 1,
            y: this.pos.y,
        });

        indices[ARROUND.BOTTOM_LEFT] = this.board.posToIndex({
            x: this.pos.x - 1,
            y: this.pos.y + 1,
        });

        indices[ARROUND.BOTTOM] = this.board.posToIndex({
            x: this.pos.x,
            y: this.pos.y + 1,
        });

        indices[ARROUND.BOTTOM_RIGHT] = this.board.posToIndex({
            x: this.pos.x + 1,
            y: this.pos.y + 1,
        });

        const arround: Cell[] = Array(8);
        indices.forEach((indice, idx): void => {
            arround[idx] = indice !== -1 ? this.board.getCell(indice) : null;
        });

        return arround;
    };

    reveal = (): void => {
        this.doubt = false;
        this.flag = false;
        this.hidden = false;
        this.updateRenderState();
    };

    hide = (): void => {
        this.hidden = true;
        this.updateRenderState();
    };

    setFlag = (flag: boolean): void => {
        this.flag = flag;
        this.updateRenderState();
    };

    setDoubt = (doubt: boolean): void => {
        this.doubt = doubt;
        this.updateRenderState();
    };

    reset = (): void => {
        this.flag = false;
        this.doubt = false;
        this.value = CELL_VALUES.BLANK;
        this.hidden = true;

        this.updateRenderState();
    };

    computeValue = (): void => {
        if (this.value === CELL_VALUES.MINE) return;

        let count = 0;
        const arround = this.getCellsArround();

        for (const cell of arround) {
            if (cell && cell.value === CELL_VALUES.MINE) count++;
        }

        this.value = count;
    };
}
