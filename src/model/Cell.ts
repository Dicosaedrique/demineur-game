enum CELL_VALUES {
    BLANK = 0,
    MINE = -1,
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

    private indice: number;
    private hidden = true;
    private value: number = CELL_VALUES.BLANK;
    private flag = false;
    private doubt = false;
    private state: RENDER_STATE = RENDER_STATE.HIDDEN;

    constructor(indice: number) {
        this.indice = indice;
    }

    // GETTERS

    getIndice = (): number => this.indice;
    getState = (): RENDER_STATE => this.state;
    isHidden = (): boolean => this.hidden;
    isFlag = (): boolean => this.flag;
    isDoubt = (): boolean => this.doubt;
    isMine = (): boolean => this.value === CELL_VALUES.MINE;
    isBlank = (): boolean => this.value === CELL_VALUES.BLANK;
    getValue = (): number => this.value;

    // SETTERS

    setMine = (): void => this.setValue(CELL_VALUES.MINE);

    setValue = (newValue: number): void => {
        this.value = newValue;
        this.updateRenderState();
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

    // METHODS

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

    reset = (): void => {
        this.flag = false;
        this.doubt = false;
        this.value = CELL_VALUES.BLANK;
        this.hidden = true;

        this.updateRenderState();
    };
}
