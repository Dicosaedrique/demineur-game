import { Howl, Howler } from "howler";
import SettingsManager from "src/model/SettingsManager";

import game_soundtrack from "src/ressources/game_soundtrack.mp3";
import menu_soundtrack from "src/ressources/menu_soundtrack.mp3";
import click_fx from "src/ressources/click_fx.mp3";
import flag_fx from "src/ressources/flag_fx.mp3";
import start_fx from "src/ressources/start_fx.mp3";
import lose_fx from "src/ressources/lose_fx.mp3";
import win_fx from "src/ressources/win_fx.mp3";
import hover_fx from "src/ressources/hover_fx.mp3";

export default class SoundManager {
    private menuSoundtrack: Howl;
    private gameSoundtrack: Howl;
    private winSound: Howl;
    private loseSound: Howl;
    private clickSound: Howl;
    private flagSound: Howl;
    private startSound: Howl;
    private hoverSound: Howl;

    private soundTracks: Howl[];
    private sounfFxs: Howl[];

    private settings: SettingsManager;

    private shouldStop = false;

    constructor() {
        this.settings = SettingsManager.getInstance();

        this.init();

        this.menuSoundtrack = new Howl({
            src: menu_soundtrack,
            loop: true,
            volume: this.settings.getSoundTrackVolume(),
        });

        this.gameSoundtrack = new Howl({
            src: game_soundtrack,
            loop: true,
            volume: this.settings.getSoundTrackVolume(),
        });

        this.winSound = new Howl({
            src: win_fx,
            volume: this.settings.getFxsVolume(),
        });

        this.loseSound = new Howl({
            src: lose_fx,
            volume: this.settings.getFxsVolume(),
        });

        this.clickSound = new Howl({
            src: click_fx,
            volume: this.settings.getFxsVolume(),
        });

        this.flagSound = new Howl({
            src: flag_fx,
            volume: this.settings.getFxsVolume(),
        });

        this.startSound = new Howl({
            src: start_fx,
            volume: this.settings.getFxsVolume(),
        });

        this.hoverSound = new Howl({
            src: hover_fx,
            volume: this.settings.getFxsVolume(),
        });

        this.soundTracks = [this.gameSoundtrack, this.menuSoundtrack];

        this.sounfFxs = [
            this.winSound,
            this.loseSound,
            this.clickSound,
            this.flagSound,
            this.startSound,
            this.hoverSound,
        ];
    }

    private init = (): void => {
        Howler.mute(this.settings.getGlobalMute());
        Howler.volume(this.settings.getGlobalVolume());
    };

    setSoundTracksVolume = (volume: number): void => {
        this.settings.setSoundTrackVolume(volume);
        this.settings.save();

        this.soundTracks.forEach((soundtrack): void => {
            soundtrack.volume(volume);
        });
    };

    setFXsVolume = (volume: number): void => {
        this.settings.setFxsVolume(volume);
        this.settings.save();

        this.sounfFxs.forEach((fx): void => {
            fx.volume(volume);
        });
    };

    menu = (): void => {
        this.menuSoundtrack.play();
    };

    start = (): void => {
        this.menuSoundtrack.stop();
        this.startSound.play();
        this.shouldStop = false;
        this.startSound.once("end", (): void => {
            if (!this.shouldStop) this.gameSoundtrack.play();

            this.shouldStop = false;
        });
    };

    win = (): void => {
        this.gameSoundtrack.stop();
        this.shouldStop = true;
        this.winSound.play();
    };

    lose = (): void => {
        this.gameSoundtrack.stop();
        this.shouldStop = true;
        this.loseSound.play();
    };

    click = (): void => {
        this.clickSound.play();
    };

    flag = (): void => {
        this.flagSound.play();
    };

    hover = (): void => {
        this.hoverSound.play();
    };

    mute = (muted = true): void => {
        Howler.mute(muted);
        this.settings.setGlobalMute(muted);
    };

    setGlobalVolume = (volume = 1): void => {
        Howler.volume(volume);
        this.settings.setGlobalVolume(volume);
    };
}
