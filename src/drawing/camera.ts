import { INTERACTION, MAX_CELL_SIZE } from "@/global/constants";
import { Vector2, Vector3, Vector4 } from "threejs-math";



export const createCamera = (canvas: HTMLCanvasElement) => {
    const position = new Vector3(0, 0, 50); // Z is zoom level
    const viewport = new Vector4(0, 0, 0, 0);
    const minZoom = INTERACTION.MINZOOM;
    const maxZoom = INTERACTION.MAXZOOM;
    let rect = canvas.getBoundingClientRect();
    const getPosition = () => position.clone();
    const getViewport = () => viewport.clone();

    const moveBy = (delta: Vector2) => {
        position.x += delta.x;
        position.y += delta.y;
    };

    const setPosition = (newPosition: Vector3) => {
        position.copy(newPosition);
    };

    const zoomBy = (delta: number): void => {
        const newZoom = position.z + delta;
        setZoom(newZoom);
    };

    const setZoom = (zoomLevel: number, centerPoint?: Vector2): void => {
        const { width, height } = getCanvasSize();
        centerPoint = centerPoint || new Vector2(width / 2, height / 2);

        const oldZoom = position.z;
        const newZoom = Math.min(Math.max(zoomLevel, minZoom), maxZoom);

        // Get the world position at the current center point before zooming
        const worldBeforeZoom = canvasToWorld(centerPoint);
        position.z = newZoom;

        // Get the world position at the same center point after zooming
        const worldAfterZoom = canvasToWorld(centerPoint);

        // Offset the camera to keep the same world point centered
        position.x += worldBeforeZoom.x - worldAfterZoom.x;
        position.y += worldBeforeZoom.y - worldAfterZoom.y;

        calculateViewport();
        document.dispatchEvent(new Event("updateZoom"));
    };

    const getCanvasSize = () => {
        return {
            width: canvas.parentElement?.clientWidth ?? canvas.clientWidth,
            height: canvas.parentElement?.clientHeight ?? canvas.clientHeight,
        };
    };

    const calculateViewport = () => {
        rect = canvas.getBoundingClientRect();
        const {width, height} = getCanvasSize();
        const start = new Vector2(position.x ,position.y);
        const end = new Vector2(width + position.x, height + position.y);
        viewport.set(start.x, start.y, end.x, end.y);
        return viewport;
    };

    const canvasToGrid = (point: Vector2) => {
        const worldPos = canvasToWorld(point);
        worldPos.divideScalar(MAX_CELL_SIZE);
        return new Vector2(Math.floor(worldPos.x), Math.floor(worldPos.y));
    };

    const canvasToWorld = (point: Vector2) => {
        rect = canvas.getBoundingClientRect();
        console.log(point)
        const mouseX = (point.x - rect.left + position.x) * (100 / position.z);
        const mouseY = (point.y - rect.top + position.y) * (100 / position.z);
        return new Vector2(mouseX,mouseY);
    };

    return {
        position,
        getPosition,
        getViewport,
        moveBy,
        zoomBy,
        setPosition,
        setZoom,
        calculateViewport,
        canvasToGrid,
    };
};
