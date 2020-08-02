import { Game, Cell } from "src/model";

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    Raycaster,
    Vector2,
    AxesHelper,
    Object3D,
    InstancedMesh,
    BoxGeometry,
    MeshPhongMaterial,
    TextureLoader,
    Texture,
    Matrix4,
    Color,
    PointLight,
    Vector3,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { CELL_SIZE, CELL_SPACING } from "src/scripts/constants";

import textureFace0 from "src/images/face_0.png";
import textureFace1 from "src/images/face_1.png";
import textureFace2 from "src/images/face_2.png";
import textureFace3 from "src/images/face_3.png";
import textureFace4 from "src/images/face_4.png";
import textureFace5 from "src/images/face_5.png";
import textureFace6 from "src/images/face_6.png";
import textureFace7 from "src/images/face_7.png";
import textureFace8 from "src/images/face_8.png";
import textureFlag from "src/images/flag.png";
import textureDoubt from "src/images/doubt.png";
import textureSide from "src/images/side.png";
import textureMine from "src/images/mine.png";
import textureHidden from "src/images/hidden.png";
import { RENDER_STATE } from "./Cell";

type CubeMaterials = {
    [state: string]: MeshPhongMaterial[];
};

type MaterialsCatalog = {
    [key: string]: MeshPhongMaterial;
};

type TexturesCatalog = {
    [key: string]: Texture;
};

type InstancedMeshCatalog = {
    [key: string]: InstancedMesh;
};

const TEXTURE_LOADER = new TextureLoader();

const TEXTURES: TexturesCatalog = {
    face_0: TEXTURE_LOADER.load(textureFace0),
    face_1: TEXTURE_LOADER.load(textureFace1),
    face_2: TEXTURE_LOADER.load(textureFace2),
    face_3: TEXTURE_LOADER.load(textureFace3),
    face_4: TEXTURE_LOADER.load(textureFace4),
    face_5: TEXTURE_LOADER.load(textureFace5),
    face_6: TEXTURE_LOADER.load(textureFace6),
    face_7: TEXTURE_LOADER.load(textureFace7),
    face_8: TEXTURE_LOADER.load(textureFace8),
    flag: TEXTURE_LOADER.load(textureFlag),
    side: TEXTURE_LOADER.load(textureSide),
    doubt: TEXTURE_LOADER.load(textureDoubt),
    mine: TEXTURE_LOADER.load(textureMine),
    hidden: TEXTURE_LOADER.load(textureHidden),
};

const MATERIALS: MaterialsCatalog = ((): MaterialsCatalog => {
    const materials: MaterialsCatalog = {};
    for (const textureKey in TEXTURES) {
        materials[textureKey] = new MeshPhongMaterial({
            map: TEXTURES[textureKey],
            specular: 0x080808,
        });
    }

    return materials;
})();

const CUBE_GEOMETRY: BoxGeometry = new BoxGeometry(
    CELL_SIZE,
    CELL_SIZE / 2,
    CELL_SIZE
);

const CUBE_MATERIALS: CubeMaterials = {
    TEST: [
        MATERIALS["face_1"],
        MATERIALS["face_2"],
        MATERIALS["face_3"],
        MATERIALS["face_4"],
        MATERIALS["face_5"],
        MATERIALS["face_6"],
    ],
    HIDDEN: [
        MATERIALS["hidden"],
        MATERIALS["hidden"],
        MATERIALS["hidden"],
        MATERIALS["hidden"],
        MATERIALS["hidden"],
        MATERIALS["hidden"],
    ],
    FLAG: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["flag"],
        MATERIALS["flag"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
    DOUBT: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["doubt"],
        MATERIALS["doubt"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
    REVEALED_0: [
        MATERIALS["face_0"],
        MATERIALS["face_0"],
        MATERIALS["face_0"],
        MATERIALS["face_0"],
        MATERIALS["face_0"],
        MATERIALS["face_0"],
    ],
    REVEALED_1: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["face_1"],
        MATERIALS["face_1"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
    REVEALED_2: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["face_2"],
        MATERIALS["face_2"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
    REVEALED_3: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["face_3"],
        MATERIALS["face_3"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
    REVEALED_4: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["face_4"],
        MATERIALS["face_4"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
    REVEALED_5: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["face_5"],
        MATERIALS["face_5"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
    REVEALED_6: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["face_6"],
        MATERIALS["face_6"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
    REVEALED_7: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["face_7"],
        MATERIALS["face_7"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
    REVEALED_8: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["face_8"],
        MATERIALS["face_8"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
    REVEALED_MINE: [
        MATERIALS["side"],
        MATERIALS["side"],
        MATERIALS["mine"],
        MATERIALS["mine"],
        MATERIALS["side"],
        MATERIALS["side"],
    ],
};

const GENERATE_INSTANCE_MESHES = (count: number): InstancedMeshCatalog => {
    const instancedMeshes: InstancedMeshCatalog = {};
    for (const renderStateKey in CUBE_MATERIALS) {
        instancedMeshes[renderStateKey] = new InstancedMesh(
            CUBE_GEOMETRY,
            CUBE_MATERIALS[renderStateKey],
            count
        );
    }

    return instancedMeshes;
};

function setColor(color: number): void {
    const newColor = new Color(color);
    for (const matKey in MATERIALS) {
        MATERIALS[matKey].color = newColor;
    }
}

const instanceMatrix = new Matrix4();

const STATS = Stats();

export default class GameRenderer {
    private renderer: WebGLRenderer;
    private raycaster: Raycaster = new Raycaster();
    private camera: PerspectiveCamera;
    private scene: Scene;
    private game: Game;
    private ambiantLight: AmbientLight;
    private controls: OrbitControls;
    private board: Object3D;
    private lastCellOn?: number = -1;
    private lastCellDown?: number = -1;
    private lastControlsAngle?: number = 0;
    private instancedMeshes: InstancedMeshCatalog;
    private rendering = false;
    private boardIsNew = false;

    constructor(game: Game) {
        this.game = game;

        this.camera = new PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 20, 0);
        this.camera.add(new PointLight(0x404040, 3));

        this.raycaster = new Raycaster();

        this.renderer = new WebGLRenderer({
            antialias: true,
        });
        console.log(window.innerWidth, window.innerHeight);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.initListenner();
        this.initScene();
        this.initControls();

        document.body.appendChild(STATS.dom); // dev

        this.requestAnimate();
    }

    private initScene = (): void => {
        this.scene = new Scene();

        this.board = new Object3D();

        this.scene.add(this.board);
        this.scene.add(this.camera);
        this.scene.add(new AxesHelper(5)); // dev

        this.ambiantLight = new AmbientLight(0x404040, 1);
        this.scene.add(this.ambiantLight);
    };

    private initControls = (): void => {
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        this.controls.target.set(0, 0, 0);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.minPolarAngle = Math.PI * (45 / 180);
        this.controls.maxPolarAngle = Math.PI * (45 / 180);
        this.controls.enablePan = false;
        this.controls.enableKeys = false;
        this.controls.minDistance = 4 * CELL_SIZE * (1 + CELL_SPACING);
        this.controls.enableRotate = false;
        this.controls.enableZoom = false;
        this.controls.autoRotate = true;
    };

    private initListenner = (): void => {
        window.addEventListener("resize", this.onWindowResize, false);

        this.renderer.domElement.addEventListener(
            "mousemove",
            this.handleMouse,
            true
        );

        this.renderer.domElement.addEventListener(
            "mousedown",
            this.handleMouse,
            true
        );

        this.renderer.domElement.addEventListener(
            "mouseup",
            this.handleMouse,
            true
        );

        this.game.on("statechange", ({ newState }): void => {
            if (newState === Game.GAME_STATE.VICTORY) this.win();
            else if (newState === Game.GAME_STATE.DEFEAT) this.lose();
            else if (newState === Game.GAME_STATE.READY) this.start();
            else if (newState === Game.GAME_STATE.MENU) this.menu();
        });
    };

    initBoard = (): void => {
        this.scene.remove(this.board);
        this.board = new Object3D();
        this.scene.add(this.board);

        const offset = new Vector2(
            this.game.getBoard().getWidth() * CELL_SIZE * (1 + CELL_SPACING),
            this.game.getBoard().getHeight() * CELL_SIZE * (1 + CELL_SPACING)
        );

        this.board.position.set(-offset.x / 2, 0, -offset.y / 2);

        const maxDistance =
            Math.max(
                this.game.getBoard().getHeight(),
                this.game.getBoard().getWidth()
            ) *
            CELL_SIZE *
            (1 + CELL_SPACING);

        this.controls.maxDistance = maxDistance * 1.2;

        this.updateBoard();
    };

    updateBoard = (): void => {
        console.log("UPDATE BOARD");

        this.board.remove(...this.board.children);
        this.instancedMeshes = GENERATE_INSTANCE_MESHES(
            this.game.getBoard().getSize()
        );

        const transform = new Object3D();

        this.game
            .getBoard()
            .getCells()
            .forEach((cell, index): void => {
                transform.rotation.set(
                    0,
                    (this.lastControlsAngle * Math.PI) / 180 || 0,
                    0
                );
                transform.position.set(
                    CELL_SIZE / 2 +
                        cell.getPos().x * CELL_SIZE * (1 + CELL_SPACING),
                    0,
                    CELL_SIZE / 2 +
                        cell.getPos().y * CELL_SIZE * (1 + CELL_SPACING)
                );

                transform.updateMatrix();

                this.instancedMeshes[cell.getState()].setMatrixAt(
                    index,
                    transform.matrix
                );
            });

        for (const key in this.instancedMeshes)
            this.board.add(this.instancedMeshes[key]);

        this.boardIsNew = true;
    };

    handleMouse = (evt: MouseEvent): void => {
        evt.preventDefault();

        if (evt.type === "mousemove") {
            const rect = (evt.target as HTMLObjectElement).getBoundingClientRect();
            const mouse = new Vector2(
                ((evt.clientX - rect.left) / window.innerWidth) * 2 - 1,
                -((evt.clientY - rect.top) / window.innerHeight) * 2 + 1
            );

            this.raycaster.setFromCamera(mouse, this.camera);
            const [intersection] = this.raycaster.intersectObjects(
                this.board.children
            );
            const beforeLastCell = this.lastCellOn;
            if (intersection && "instanceId" in intersection) {
                this.lastCellOn = intersection.instanceId;
            } else {
                this.lastCellOn = -1;
            }

            if (this.lastCellOn !== beforeLastCell) {
                if (this.lastCellOn !== -1) {
                    const cell = this.game.getBoard().getCell(this.lastCellOn);
                    if (cell.getState() === RENDER_STATE.HIDDEN)
                        this.applyMatrixToCell(
                            cell,
                            new Matrix4().makeTranslation(0, -CELL_SIZE / 10, 0)
                        );
                }

                if (beforeLastCell !== -1) {
                    const cell = this.game.getBoard().getCell(beforeLastCell);
                    if (cell.getState() === RENDER_STATE.HIDDEN)
                        this.applyMatrixToCell(
                            cell,
                            new Matrix4().makeTranslation(0, CELL_SIZE / 10, 0)
                        );
                }
            }
        } else if (evt.type === "mousedown") {
            this.lastCellDown = this.lastCellOn;
        } else if (evt.type === "mouseup") {
            if (
                this.lastCellDown === this.lastCellOn &&
                this.lastCellDown !== -1 &&
                this.lastCellOn !== -1
            ) {
                const cell = this.game.getBoard().getCell(this.lastCellDown);
                const cellsUpdated = this.game.click(cell, evt.button);

                if (cellsUpdated.length > 0) this.updateBoard();

                this.lastCellOn = -1;
                this.lastCellDown = -1;
            }
        }
    };

    private applyMatrixToCell = (cell: Cell, matrix: Matrix4): void => {
        const state = cell.getState();
        this.instancedMeshes[state].getMatrixAt(cell.getId(), instanceMatrix);
        instanceMatrix.multiply(matrix);
        this.instancedMeshes[state].setMatrixAt(cell.getId(), instanceMatrix);
        this.instancedMeshes[state].instanceMatrix.needsUpdate = true;
    };

    private onWindowResize = (): void => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    attach = (element: HTMLElement): void => {
        element.appendChild(this.renderer.domElement);
    };

    private renderBoard = (): void => {
        let angle = (this.controls.getAzimuthalAngle() * 180) / Math.PI;

        if (angle < 45 && angle > -45) angle = 0;
        else if (angle > 45 && angle < 135) angle = 90;
        else if (angle < -45 && angle > -135) angle = -90;
        else angle = 180;

        if (this.lastControlsAngle !== angle) {
            const rotateMatrix = new Matrix4().makeRotationY(
                ((angle - this.lastControlsAngle) * Math.PI) / 180
            );
            this.game
                .getBoard()
                .getCells()
                .forEach((_, idx): void => {
                    const state = this.game.getBoard().getCell(idx).getState();
                    this.instancedMeshes[state].getMatrixAt(
                        idx,
                        instanceMatrix
                    );
                    instanceMatrix.multiply(rotateMatrix);
                    this.instancedMeshes[state].setMatrixAt(
                        idx,
                        instanceMatrix
                    );
                    this.instancedMeshes[
                        state
                    ].instanceMatrix.needsUpdate = true;
                });

            this.lastControlsAngle = angle;
        }

        return;
    };

    private render = (): void => {
        STATS.update();

        this.controls.update();
        this.renderBoard();
        this.renderer.render(this.scene, this.camera);
    };

    private animate = (): void => {
        requestAnimationFrame(this.animate);

        this.render();
    };

    private requestAnimate = (): void => {
        if (!this.rendering) {
            this.rendering = true;
            this.animate();
        }
    };

    private menu = (): void => {
        this.controls.minPolarAngle = Math.PI * (45 / 180);
        this.controls.maxPolarAngle = Math.PI * (45 / 180);
        this.controls.enableRotate = false;
        this.controls.enableZoom = false;
        this.controls.autoRotate = true;

        this.initBoard();
        setColor(0x0000ff); // temp
    };

    private start = (): void => {
        const maxDistance =
            Math.max(
                this.game.getBoard().getHeight(),
                this.game.getBoard().getWidth()
            ) *
            CELL_SIZE *
            (1 + CELL_SPACING);
        this.camera.position.y = maxDistance;

        this.controls.enableRotate = true;
        this.controls.enableZoom = true;
        this.controls.autoRotate = false;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI * (60 / 180);
    };

    private win = (): void => {
        this.game
            .getBoard()
            .getCells()
            .forEach((cell): void => cell.reveal());
        this.updateBoard();
        setColor(0x00ff00);
        setTimeout(this.game.menu, 5000);
        console.log("on a gagné !");
    };

    private lose = (): void => {
        this.game
            .getBoard()
            .getCells()
            .forEach((cell): void => cell.reveal());
        this.updateBoard();
        setColor(0xff0000);
        setTimeout(this.game.menu, 5000);
        console.log("on a perdu !");
    };
}
