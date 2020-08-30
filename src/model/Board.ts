import { rangedInterval, randomInArray } from "src/scripts/utils";
import Cell from "src/model/Cell";

import {
    MIN_MINE_DENSITY,
    MAX_MINE_DENSITY,
    MAX_BOARD_SIZE,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
    DEFAULT_MINE_DENSITY,
} from "src/scripts/constants";

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

function getMineDensity(mineDensity: number): number {
    return rangedInterval(mineDensity, MIN_MINE_DENSITY, MAX_MINE_DENSITY);
}

export class BoardConfig {
    private width: number;
    private height: number;
    private mineDensity: number;

    constructor(
        width: number = DEFAULT_WIDTH,
        height: number = DEFAULT_HEIGHT,
        mineDensity: number = DEFAULT_MINE_DENSITY
    ) {
        this.width = width;
        this.height = height;
        this.mineDensity = getMineDensity(mineDensity);
    }

    getWidth = (): number => Math.min(this.width, MAX_BOARD_SIZE);
    getHeight = (): number => Math.min(this.height, MAX_BOARD_SIZE);
    getMineDensity = (): number => this.mineDensity;

    getSize = (): number => this.getWidth() * this.getHeight();
}

export default class Board {
    private cells: Cell[];
    private config: BoardConfig;
    private mineCount: number;

    constructor(config: BoardConfig, autoInit = false, cellIndice?: number) {
        this.mineCount = 0;

        this.setConfig(config, autoInit, cellIndice);
    }

    // GETTERS

    getConfig = (): BoardConfig => this.config;
    getCells = (): Cell[] => this.cells;
    getCell = (idx: number): Cell => this.cells[idx];
    getMineCount = (): number => this.mineCount;

    // SETTERS

    setConfig = (
        config: BoardConfig,
        autoInit = false,
        cellIndice?: number
    ): void => {
        this.config = config;
        this.generate(autoInit, cellIndice);
    };

    // METHODS

    private generate = (autoInit = false, cellIndice?: number): void => {
        this.cells = Array.from(
            Array(this.config.getSize()),
            (_, indice) => new Cell(indice)
        );

        if (autoInit === true) {
            this.init(cellIndice);
        }
    };

    init = (cellIndice?: number): number[] => {
        this.reset();

        let boardIndices = Array.from(
            Array(this.config.getSize()),
            (_, idx) => idx
        );

        if (this.isCell(cellIndice)) {
            boardIndices[cellIndice] = -1;

            for (const cellArroundIndice of this.getCellsArround(cellIndice)) {
                if (cellArroundIndice !== null) {
                    boardIndices[cellArroundIndice] = -1;
                }
            }

            boardIndices = boardIndices.filter(
                (idx: number): boolean => idx !== -1
            );
        }

        this.mineCount = Math.round(
            (this.config.getMineDensity() / 100) * (this.config.getSize() - 9)
        );

        for (let i = 0; i < this.mineCount; i++) {
            const randomIndice = randomInArray(boardIndices, true);

            if (this.isCell(randomIndice)) {
                this.getCell(randomIndice).setMine();

                for (const cellArroundIndice of this.getCellsArround(
                    randomIndice
                )) {
                    if (this.isCell(cellArroundIndice)) {
                        if (!this.getCell(cellArroundIndice).isMine()) {
                            this.getCell(cellArroundIndice).setValue(
                                this.getCell(cellArroundIndice).getValue() + 1
                            );
                        }
                    }
                }
            }
        }

        if (this.isCell(cellIndice)) {
            return this.reveal(cellIndice);
        }

        return [];
    };

    private getCellsArround = (cellIndice: number): number[] => {
        const indices: number[] = Array.from(Array(8), () => null);
        const cellPos = this.indiceToPos(cellIndice);

        if (cellPos !== null) {
            indices[ARROUND.TOP_LEFT] = this.posToIndice({
                x: cellPos.x - 1,
                y: cellPos.y - 1,
            });

            indices[ARROUND.TOP] = this.posToIndice({
                x: cellPos.x,
                y: cellPos.y - 1,
            });

            indices[ARROUND.TOP_RIGHT] = this.posToIndice({
                x: cellPos.x + 1,
                y: cellPos.y - 1,
            });

            indices[ARROUND.LEFT] = this.posToIndice({
                x: cellPos.x - 1,
                y: cellPos.y,
            });

            indices[ARROUND.RIGHT] = this.posToIndice({
                x: cellPos.x + 1,
                y: cellPos.y,
            });

            indices[ARROUND.BOTTOM_LEFT] = this.posToIndice({
                x: cellPos.x - 1,
                y: cellPos.y + 1,
            });

            indices[ARROUND.BOTTOM] = this.posToIndice({
                x: cellPos.x,
                y: cellPos.y + 1,
            });

            indices[ARROUND.BOTTOM_RIGHT] = this.posToIndice({
                x: cellPos.x + 1,
                y: cellPos.y + 1,
            });
        }

        return indices;
    };

    reveal = (cellIndice: number): number[] => {
        return this.isCell(cellIndice)
            ? this.cellsRevealWorker(cellIndice, [])
            : [];
    };

    private cellsRevealWorker = (
        currentCellIndice: number,
        computedCells: number[]
    ): number[] => {
        const revealedCells: number[] = [];

        if (computedCells.includes(currentCellIndice)) return revealedCells;

        if (this.getCell(currentCellIndice).isHidden()) {
            this.getCell(currentCellIndice).reveal();
            revealedCells.push(currentCellIndice);
        }

        computedCells.push(currentCellIndice);

        if (this.getCell(currentCellIndice).isBlank()) {
            for (const cellAroundIndice of this.getCellsArround(
                currentCellIndice
            )) {
                if (
                    this.isCell(cellAroundIndice) &&
                    !this.getCell(cellAroundIndice).isFlag() &&
                    !this.getCell(cellAroundIndice).isDoubt()
                ) {
                    revealedCells.push(
                        ...this.cellsRevealWorker(
                            cellAroundIndice,
                            computedCells
                        )
                    );
                }
            }
        }

        return revealedCells;
    };

    reset = (): void => {
        this.cells.forEach((cell): void => {
            cell.reset();
        });
    };

    posToIndice = (pos: Vector2D): number | null => {
        if (
            pos.x >= this.config.getWidth() ||
            pos.x < 0 ||
            pos.y >= this.config.getHeight() ||
            pos.y < 0
        )
            return null;
        else return pos.y * this.config.getWidth() + pos.x;
    };

    indiceToPos = (cellIndice: number): Vector2D | null => {
        if (!this.isCell(cellIndice)) return null;

        return {
            x: cellIndice % this.config.getWidth(),
            y: Math.floor(cellIndice / this.config.getWidth()),
        };
    };

    isCell = (cellIndice: number): boolean =>
        this.cells[cellIndice] instanceof Cell;
}
