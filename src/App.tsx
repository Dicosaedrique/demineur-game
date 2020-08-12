import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./styles/App.css";

import GameComponent from "src/components/GameComponent";

interface State {
    start: boolean;
}

import { WEBGL } from "src/scripts/WebGlChecker";

const WEBGL_AVAILABLE = WEBGL.isWebGLAvailable();

export default function (): JSX.Element {
    if (WEBGL_AVAILABLE) {
        return (
            <Router>
                <Route path="/">
                    <GameComponent />
                </Route>
            </Router>
        );
    } else {
        return (
            <p>
                WebGL n'est pas disponible sur votre navigateur ! Veuillez
                réessayer sur un navigateur plus récent ! WebGL est utilisé pour
                faire le rendu du jeu de démineur et est donc nécéssaire pour
                fonctionner !
            </p>
        );
    }
}
