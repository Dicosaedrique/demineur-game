export const CELL_SIZE = 1;
export const CELL_SPACING = 0.1;

export const DEFAULT_HEIGHT = 20;
export const DEFAULT_WIDTH = 20;

export const MIN_MINE_DENSITY = 8;
export const MAX_MINE_DENSITY = 25;
export const DEFAULT_MINE_DENSITY = 18;

export enum DIFFICULTY {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

export const DIFFICULTIES_LITTERAL = {
    [DIFFICULTY.EASY]: "Facile",
    [DIFFICULTY.MEDIUM]: "Moyen",
    [DIFFICULTY.HARD]: "Difficile",
};

export const GAME_PRESETS = {
    [DIFFICULTY.EASY]: {
        width: 10,
        height: 8,
        mineDensity: 12,
    },
    [DIFFICULTY.MEDIUM]: {
        width: 18,
        height: 14,
        mineDensity: 18,
    },
    [DIFFICULTY.HARD]: {
        width: 24,
        height: 19,
        mineDensity: 25,
    },
};
