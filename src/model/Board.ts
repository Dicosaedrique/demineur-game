import { rangedInterval, randomInArray } from "src/scripts/utils";
import { Cell } from "src/model";

import {
    MIN_MINE_DENSITY,
    MAX_MINE_DENSITY,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
    DEFAULT_MINE_DENSITY,
} from "src/scripts/constants";
import { log } from "three";

function getMineDensity(mineDensity: number): number {
    return rangedInterval(mineDensity, MIN_MINE_DENSITY, MAX_MINE_DENSITY);
}

export default class Board {
    private cells: Cell[];
    private width: number;
    private height: number;
    private mineDensity: number;
    private mineCount: number;

    constructor(
        width: number = DEFAULT_WIDTH,
        height: number = DEFAULT_HEIGHT,
        mineDensity: number = DEFAULT_MINE_DENSITY
    ) {
        this.width = width;
        this.height = height;
        this.mineDensity = getMineDensity(mineDensity);

        this.generateBlankBoard();
    }

    getWidth = (): number => this.width;
    getHeight = (): number => this.height;
    getMineDensity = (): number => this.mineDensity;
    getMineCount = (): number => this.mineCount;

    reset = (): void => {
        this.cells.forEach((cell): void => {
            cell.reset();
        });
    };

    private generateBlankBoard = (): void => {
        this.cells = Array(this.getSize());

        for (let idx = 0; idx < this.cells.length; idx++) {
            this.cells[idx] = new Cell(idx, this.indexToPos(idx), this);
        }
    };

    init = (cell?: Cell): number[] => {
        this.reset();

        let boardIndices = Array.from(Array(this.getSize()), (_, idx) => idx);

        if (cell) {
            boardIndices[cell.getId()] = -1;

            for (const arroundCell of cell.getCellsArround()) {
                if (arroundCell) {
                    boardIndices[arroundCell.getId()] = -1;
                }
            }

            boardIndices = boardIndices.filter(
                (idx: number): boolean => idx !== -1
            );
        }

        this.mineCount = Math.floor(
            (this.mineDensity / 100) * (this.getSize() - 9)
        );

        for (let i = 0; i < this.mineCount; i++) {
            const randomIndice = randomInArray(boardIndices, true);

            this.cells[randomIndice].setMine();

            const arround = this.cells[randomIndice].getCellsArround();

            for (const arroundCell of arround) {
                if (
                    arroundCell &&
                    arroundCell.getValue() !== Cell.CELL_VALUES.MINE
                )
                    arroundCell.setValue(arroundCell.getValue() + 1);
            }
        }

        if (cell) {
            return this.reveal(cell);
        }

        return [];
    };

    reveal = (cell: Cell): number[] => {
        const revealedCells: number[] = [];
        function cellRevealWorker(currenCell: Cell, cellsDone: Cell[]): void {
            if (cellsDone.includes(currenCell)) return;

            if (currenCell.isHidden()) {
                currenCell.reveal();
                revealedCells.push(currenCell.getId());
            }

            cellsDone.push(currenCell);

            if (currenCell.getValue() === Cell.CELL_VALUES.BLANK) {
                const arround = currenCell.getCellsArround();
                for (const cellAround of arround) {
                    if (cellAround) cellRevealWorker(cellAround, cellsDone);
                }
            }
        }

        cellRevealWorker(cell, []);

        return revealedCells;
    };

    posToIndex = (pos: Vector2D): number => {
        if (
            pos.x >= this.width ||
            pos.x < 0 ||
            pos.y >= this.height ||
            pos.y < 0
        )
            return -1;
        else return pos.y * this.width + pos.x;
    };

    indexToPos = (indice: number): Vector2D => {
        return {
            x: indice % this.width,
            y: Math.floor(indice / this.width),
        };
    };

    getCells = (): Cell[] => this.cells;

    getSize = (): number => this.width * this.height;

    getCell = (idx: number): Cell => this.cells[idx] || null;
}
