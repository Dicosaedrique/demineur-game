import { BoardConfig } from "src/model/Board";

export const CELL_SIZE = 1;
export const CELL_SPACING = 0.1;

export const DEFAULT_HEIGHT = 20;
export const DEFAULT_WIDTH = 20;

export const MIN_MINE_DENSITY = 8;
export const MAX_MINE_DENSITY = 25;
export const DEFAULT_MINE_DENSITY = 18;

export enum CONTROLS_TYPE {
    PANNING,
    SPHERE,
}

export enum GAME_DIFFICULTY {
    EASY,
    MEDIUM,
    HARD,
    USER,
}

export const DIFFICULTIES_LITTERAL = {
    [GAME_DIFFICULTY.EASY]: "Facile",
    [GAME_DIFFICULTY.MEDIUM]: "Moyen",
    [GAME_DIFFICULTY.HARD]: "Difficile",
    [GAME_DIFFICULTY.USER]: "Personalisée",
};

export const GAME_PRESETS = {
    [GAME_DIFFICULTY.EASY]: new BoardConfig(10, 8, 12),
    [GAME_DIFFICULTY.MEDIUM]: new BoardConfig(18, 14, 18),
    [GAME_DIFFICULTY.HARD]: new BoardConfig(24, 19, 25),
};

export enum GAME_COLOR {
    ORANGE,
    JAUNE,
    BLEU,
    CYAN,
    VIOLET,
    ROSE,
}

type ColorCatalog = {
    [color: number]: {
        displayName: string;
        code: number;
        hexa: string;
    };
};

export const COLOR_PRESETS: ColorCatalog = {
    [GAME_COLOR.ORANGE]: {
        displayName: "ORANGE",
        code: 0xff6600,
        hexa: "#FF6600",
    },
    [GAME_COLOR.JAUNE]: {
        displayName: "JAUNE",
        code: 0xffff00,
        hexa: "#FFFF00",
    },
    [GAME_COLOR.CYAN]: {
        displayName: "CYAN",
        code: 0x00ffff,
        hexa: "#00FFFF",
    },
    [GAME_COLOR.BLEU]: {
        displayName: "BLEU",
        code: 0x0033ff,
        hexa: "#0033FF",
    },
    [GAME_COLOR.VIOLET]: {
        displayName: "VIOLET",
        code: 0xcc00ff,
        hexa: "#CC00FF",
    },
    [GAME_COLOR.ROSE]: {
        displayName: "ROSE",
        code: 0xff00ff,
        hexa: "#FF00FF",
    },
};
