export function isFullScreen() {
    return (
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
            document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
            document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null)
    );
}

export function setFullScreen(fullScreen, callback) {
    try {
        if (typeof fullScreen !== "boolean" || isFullScreen() === fullScreen)
            return;

        let docElm = document.documentElement;
        let promise;

        if (fullScreen) {
            if (docElm.requestFullscreen) {
                promise = docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                promise = docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                promise = docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
                promise = docElm.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                promise = document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                promise = document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                promise = document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                promise = document.msExitFullscreen();
            }
        }

        promise
            .then(err => {
                if (err) callback(err);
                else callback();
            })
            .catch(err => callback(err));
    } catch (err) {
        console.log(err);
        callback(err);
    }
}
