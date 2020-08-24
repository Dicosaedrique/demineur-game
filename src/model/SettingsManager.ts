import { isNotUndef, isUndef } from "src/scripts/utils";
import {
    GAME_DIFFICULTY,
    GAME_COLOR,
    CONTROLS_TYPE,
} from "src/scripts/constants";

type UserPreset = {
    width: number;
    height: number;
    mineDensity: number;
};

type Score = {
    name: string | null;
    time: number;
    difficulty: GAME_DIFFICULTY;
    preset?: UserPreset;
};

export default class SettingsManager {
    private static instance: SettingsManager;

    static STORAGE_KEY = "SETTINGS_DEMINEUR_3D";

    private soundTrackVolume: number;
    private fxsVolume: number;
    private globalMute: boolean;
    private globalVolume: number;
    private colorPreset: GAME_COLOR;
    private difficulty: GAME_DIFFICULTY;
    private userPreset: UserPreset;
    private controls: CONTROLS_TYPE;
    private scores: Score[];

    public static getInstance(): SettingsManager {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }

        return SettingsManager.instance;
    }

    private constructor() {
        this.reset();
        this.restore();
    }

    // GETTERS

    getSoundTrackVolume = (): number => this.soundTrackVolume;
    getFxsVolume = (): number => this.fxsVolume;
    getGlobalMute = (): boolean => this.globalMute;
    getGlobalVolume = (): number => this.globalVolume;
    getColorPreset = (): GAME_COLOR => this.colorPreset;
    getDifficulty = (): GAME_DIFFICULTY => this.difficulty;
    getUserPreset = (): UserPreset => this.userPreset;
    getControls = (): CONTROLS_TYPE => this.controls;
    getScores = (): Score[] => this.scores;

    // SETTERS

    setSoundTrackVolume = (value: number): void => {
        this.soundTrackVolume = value;
        this.save();
    };
    setFxsVolume = (value: number): void => {
        this.fxsVolume = value;
        this.save();
    };
    setGlobalMute = (value: boolean): void => {
        this.globalMute = value;
        this.save();
    };
    setGlobalVolume = (value: number): void => {
        this.globalVolume = value;
        this.save();
    };
    setColorPreset = (value: GAME_COLOR): void => {
        this.colorPreset = value;
        this.save();
    };
    setDifficulty = (value: GAME_DIFFICULTY): void => {
        this.difficulty = value;
        this.save();
    };
    setControls = (value: CONTROLS_TYPE): void => {
        this.controls = value;
        this.save();
    };
    setUserPreset = (value: UserPreset): void => {
        this.userPreset = value;
        this.save();
    };

    // METHODS

    addScore = (score: Score): void => {
        this.scores.push(score);
    };

    reset = (): void => {
        this.soundTrackVolume =
            SettingsManager.DEFAULT_SETTINGS.soundTrackVolume;
        this.fxsVolume = SettingsManager.DEFAULT_SETTINGS.fxsVolume;
        this.globalMute = SettingsManager.DEFAULT_SETTINGS.globalMute;
        this.colorPreset = SettingsManager.DEFAULT_SETTINGS.colorPreset;
        this.difficulty = SettingsManager.DEFAULT_SETTINGS.difficulty;
        this.userPreset = SettingsManager.DEFAULT_SETTINGS.userPreset;
        this.controls = SettingsManager.DEFAULT_SETTINGS.controls;
        this.scores = [];
    };

    save = (): void => {
        const savableState = {
            soundTrackVolume: this.soundTrackVolume,
            fxsVolume: this.fxsVolume,
            globalMute: this.globalMute,
            globalVolume: this.globalVolume,
            colorPreset: this.colorPreset,
            difficulty: this.difficulty,
            userPreset: this.userPreset,
            controls: this.controls,
            scores: this.scores,
        };

        localStorage.setItem(
            SettingsManager.STORAGE_KEY,
            JSON.stringify(savableState)
        );
    };

    private restore = (): void => {
        const savedState = JSON.parse(
            localStorage.getItem(SettingsManager.STORAGE_KEY)
        );

        const {
            soundTrackVolume,
            fxsVolume,
            globalMute,
            globalVolume,
            colorPreset,
            difficulty,
            userPreset,
            controls,
            scores,
        } = savedState;

        if (soundTrackVolume && typeof soundTrackVolume === "number")
            this.setSoundTrackVolume(soundTrackVolume);

        if (fxsVolume && typeof fxsVolume === "number")
            this.setFxsVolume(fxsVolume);

        if (globalMute && typeof globalMute === "boolean")
            this.setGlobalMute(globalMute);

        if (globalVolume && typeof globalVolume === "number")
            this.setGlobalVolume(globalVolume);

        if (
            colorPreset &&
            typeof colorPreset === "number" &&
            colorPreset in GAME_COLOR
        )
            this.setColorPreset(colorPreset);

        if (
            difficulty &&
            typeof difficulty === "number" &&
            difficulty in GAME_DIFFICULTY
        )
            this.setDifficulty(difficulty);

        if (
            userPreset &&
            typeof userPreset === "object" &&
            "width" in userPreset &&
            "height" in userPreset &&
            "mineDensity" in userPreset
        )
            this.setUserPreset(userPreset);

        if (
            controls &&
            typeof controls === "number" &&
            controls in CONTROLS_TYPE
        )
            this.setControls(controls);

        if (scores && typeof scores === "object" && scores instanceof Array) {
            for (const score of scores) {
                if (
                    isNotUndef(score.name) &&
                    (typeof score.name === "string" || score.name === null) &&
                    typeof score.time === "number" &&
                    isNotUndef(score.difficulty) &&
                    typeof score.difficulty === "number" &&
                    score.difficulty in GAME_DIFFICULTY
                ) {
                    if (
                        score.difficulty === GAME_DIFFICULTY.USER &&
                        (isUndef(score.preset) ||
                            !("width" in score.preset) ||
                            !("height" in score.preset) ||
                            !("mineDensity" in score.preset))
                    )
                        continue;

                    this.addScore(score);
                }
            }
        }
    };

    static DEFAULT_SETTINGS = {
        soundTrackVolume: 0.3,
        fxsVolume: 1.0,
        globalMute: false,
        globalVolume: 1.0,
        colorPreset: GAME_COLOR.BLEU,
        difficulty: GAME_DIFFICULTY.EASY,
        controls: CONTROLS_TYPE.SPHERE,
        userPreset: {
            width: 10,
            height: 10,
            mineDensity: 20,
        },
    };
}
