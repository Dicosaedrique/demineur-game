import React from "react";
import ReactDOM from "react-dom";

import ReactApp from "src/App";

function start(): void {
    ReactDOM.render(
        React.createElement(ReactApp, null),
        document.getElementById("root")
    );
}

window.onload = (): void => {
    start();
};
