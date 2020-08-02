export function rangedInterval(val: number, min: number, max: number): number {
    return val < min ? min : val > max ? max : val;
}

export function randomInArray<T>(array: T[], deleteAfter = false): T {
    const rdmIndex = Math.floor(Math.random() * array.length);
    const returnElem = array[rdmIndex];

    if (deleteAfter) array.splice(rdmIndex, 1);
    return returnElem;
}

export function requestFullScreen(): void {
    eval(`
        try {
            var isInFullScreen =
                (document.fullscreenElement && document.fullscreenElement !== null) ||
                (document.webkitFullscreenElement &&
                    document.webkitFullscreenElement !== null) ||
                (document.mozFullScreenElement &&
                    document.mozFullScreenElement !== null) ||
                (document.msFullscreenElement && document.msFullscreenElement !== null);

            var docElm = document.documentElement;
            if (!isInFullScreen) {
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                } else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                } else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen();
                } else if (docElm.msRequestFullscreen) {
                    docElm.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        } catch (err) {
            console.log(err);
        }
    `);
}

export function isFullScreen(): boolean {
    return (screen.availHeight || screen.height - 30) <= window.innerHeight;
}
