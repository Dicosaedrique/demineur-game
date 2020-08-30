import { createMuiTheme, Theme } from "@material-ui/core/styles";

export function rangedInterval(val: number, min: number, max: number): number {
    return val < min ? min : val > max ? max : val;
}

export function randomInArray<T>(array: T[], deleteAfter = false): T {
    const rdmIndex = Math.floor(Math.random() * array.length);
    const returnElem = array[rdmIndex];

    if (deleteAfter) array.splice(rdmIndex, 1);
    return returnElem;
}

export function cloneOject(obj: Obj): Obj {
    const clone: Obj = {};
    for (const key in obj)
        clone[key] =
            typeof obj[key] === "object" ? cloneOject(obj[key]) : obj[key];

    return clone;
}

export function isUndef(value: any): boolean {
    return value === void 0;
}

export function isNotUndef(value: any): boolean {
    return value !== void 0;
}

export function mapObject<T>(
    object: Obj,
    callback: (key: any, value: any, index: number) => T
): T[] {
    const res = [];
    let index = 0;

    for (const key in object) {
        res.push(callback(key, object[key], index));
        index++;
    }

    return res;
}

export function mapEnum<T>(
    enumObj: Obj,
    callback: (value: any, index: number) => T
): T[] {
    const res = [];
    let index = 0;

    for (const key in enumObj) {
        if (isNaN(Number(key))) {
            res.push(callback(enumObj[key], index));
            index++;
        }
    }

    return res;
}

export function isBrowserInFullscreen(): boolean {
    return !window.screenTop && !window.screenY;
}

export function createPrimaryTheme(hexaColor: string): Theme {
    return createMuiTheme({
        palette: {
            type: "dark",
            primary: {
                main: hexaColor,
            },
        },
        overrides: {
            MuiFormControlLabel: {
                label: {
                    color: hexaColor,
                },
            },
        },
    });
}

export function formatNumber(number: number, digit: number): string {
    const string = number.toString();
    const lengthDiff = digit - string.length;

    return lengthDiff <= 0
        ? string
        : Array(lengthDiff + 1)
              .join("0")
              .concat(string);
}

export function formatTime(timeMs: number): string {
    const timeSec = Math.floor(timeMs / 1000);
    const seconds = timeSec % 60;
    const minutes = Math.floor(timeSec / 60);

    return `${formatNumber(minutes, 2)}:${formatNumber(seconds, 2)}`;
}

export function toRadian(deg: number): number {
    return (Math.PI * deg) / 180;
}

export function toDegree(rad: number): number {
    return (rad * 180) / Math.PI;
}
