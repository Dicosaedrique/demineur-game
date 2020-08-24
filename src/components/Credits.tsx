import React from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

export default function Credits(): JSX.Element {
    return (
        <div>
            <Typography variant="h3" color="primary" gutterBottom>
                CRÉDITS
            </Typography>

            <br />
            <Typography variant="h4" color="primary">
                CRÉÉ PAR
            </Typography>

            <br />
            <Typography variant="h5" color="primary">
                Antoine Bouabana (
                <Link
                    color="primary"
                    href="https://github.com/Dicosaedrique"
                    target="_blank"
                    rel="noreferrer"
                    title="Page Github"
                >
                    Dicosaedrique - Github
                </Link>
                )
            </Typography>

            <br />
            <br />
            <br />
            <Typography variant="h4" color="primary">
                Musiques et sons
            </Typography>

            <br />
            <Typography variant="h5" color="primary">
                <span className="underline">Son de départ :</span> Joth -{" "}
                <Link
                    color="primary"
                    href="https://opengameart.org/content/7-space-sounds"
                    target="_blank"
                    rel="noreferrer"
                    title="Vers le son"
                >
                    7 Space Sounds
                </Link>
            </Typography>

            <br />
            <br />
            <Typography variant="h5" color="primary">
                <span className="underline">Son de victoire :</span> Eric Matyas
                "PowerUp9" - (
                <Link
                    color="primary"
                    href="https://soundimage.org/"
                    target="_blank"
                    rel="noreferrer"
                    title="Site internet d'Eric Matyas"
                >
                    soundimage.org
                </Link>
                )
            </Typography>

            <br />
            <Typography variant="h5" color="primary">
                <span className="underline">Son de défaite :</span> Eric Matyas
                "PowerDown3" - (
                <Link
                    color="primary"
                    href="https://soundimage.org/"
                    target="_blank"
                    rel="noreferrer"
                    title="Site internet d'Eric Matyas"
                >
                    soundimage.org
                </Link>
                )
            </Typography>

            <br />
            <Typography variant="h5" color="primary">
                <span className="underline">Musique en jeu :</span> Eric Matyas
                "Arcade Heroes" - (
                <Link
                    color="primary"
                    href="https://soundimage.org/"
                    target="_blank"
                    rel="noreferrer"
                    title="Site internet d'Eric Matyas"
                >
                    soundimage.org
                </Link>
                )
            </Typography>

            <br />
            <Typography variant="h5" color="primary">
                <span className="underline">Musique du menu :</span> Eric Matyas
                "Arcade Puzzler" - (
                <Link
                    color="primary"
                    href="https://soundimage.org/"
                    target="_blank"
                    rel="noreferrer"
                    title="Site internet d'Eric Matyas"
                >
                    soundimage.org
                </Link>
                )
            </Typography>
        </div>
    );
}
