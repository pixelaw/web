import { INTERACTION, MAX_CELL_SIZE } from "@/global/constants";
import { Vector2, Vector3, Vector4 } from "threejs-math";

// const cameraFront = new Vector3(0, 0, 1);
// const cameraUp = new Vector3(0, 1, 0);

export const createCamera = (canvas: HTMLCanvasElement) => {
    const position = new Vector3(0, 0, 50); // Z is zoom
    // const projectionMatrix = new Matrix4();
    // const viewMatrix = new Matrix4();
    const viewport = new Vector4(0, 0, 0, 0);
    // FOV
    // ASPECT
    const minZoom = INTERACTION.MINZOOM;
    const maxZoom = INTERACTION.MAXZOOM;

    // const getAspect = () => {
    //     return width / height;
    // };
    // const zFar = 0;
    // const zNear = -20;

    // const getPosition = () => position.clone();
    // const getProjectionMatrix = () => projectionMatrix.clone();
    // const adjustProjection = (fov: number, aspect: number, zfar: number, znear: number) => {
    //     projectionMatrix.makePerspective(-1, 1, 1, -1, zfar, znear);
    // };
    // const getViewMatrix = () => {
    //     viewMatrix.identity();
    //     viewMatrix.lookAt(
    //         new Vector3(0, 0, -20),
    //         cameraFront.clone().add(new Vector3(position.x, position.y, 0)),
    //         cameraUp,
    //     );
    // };
    const getPosition = () => position.clone();
    const getViewport = () => viewport.clone();

    const moveBy = (delta: Vector2) => {
        position.x += delta.x;
        position.y += delta.y;
    };

    const setPosition = (position: Vector3) => {
        position.copy(position);
    };

    const zoomBy = (delta: number) => {
        setZoom(position.z + delta);
        document.dispatchEvent(new Event("updateZoom"));
    };

    const setZoom = (zoomLevel: number) => {
        position.z = Math.min(Math.max(zoomLevel, minZoom), maxZoom);
        document.dispatchEvent(new Event("updateZoom"));
    };

    const translate = (translationDelta: Vector3) => {
        throw new Error("Method not implemented.");
        // Translate the camera position
    };

    const calculateViewport = () => {
        const { width, height } = canvas;
        const cellSize = MAX_CELL_SIZE * (position.z / 100);
        let xStart = Math.floor(-position.x / cellSize);
        let yStart = Math.floor(-position.y / cellSize);
        let xEnd = Math.ceil((width - position.x) / cellSize);
        let yEnd = Math.ceil((height - position.y) / cellSize);
        viewport.set(xStart, yStart, xEnd, yEnd);
        return viewport;
    };

    const canvasToGrid = (point: Vector2) => {
        const worldPos = canvasToCamera(point);
        const viewWidth = viewport.z + position.x;
        const viewHeight = viewport.w + position.y;

        const x = worldPos.x * viewWidth;
        const y = worldPos.y * viewHeight;

        const gridX = Math.floor(x);
        const gridY = Math.floor(y);
        return new Vector2(gridX, gridY);
    };

    const canvasToCamera = (point: Vector2) => {
        const rect = canvas.getBoundingClientRect();
        // normalize point to camera space
        const x = point.x - rect.left;
        const y = point.y - rect.top;

        const xNormalized = x / rect.width;
        const yNormalized = y / rect.height;

        const z = position.z;
        const p = new Vector3(xNormalized, yNormalized, z);
        return p;
    };

    return {
        position,
        getPosition,
        // getProjectionMatrix,
        // adjustProjection,
        // getViewMatrix,
        // getViewport,
        getViewport,
        moveBy,
        zoomBy,
        setPosition,
        setZoom,
        translate,
        calculateViewport,
        canvasToGrid,
    };
};
