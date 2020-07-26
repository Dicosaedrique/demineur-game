import React from "react";

import logo from "./images/logo.svg";
import "./styles/App.css";

interface State {
    ready: boolean;
}

export default class App extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            ready: true,
        };
    }

    render(): JSX.Element {
        const { ready } = this.state;

        if (ready) {
            return (
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <p>
                            Edit <code>src/App.js</code> and save to reload.
                        </p>
                        <a
                            className="App-link"
                            href="https://reactjs.org"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Learn React from
                        </a>
                    </header>
                </div>
            );
        } else {
            return null;
        }
    }
}
