import { INTERACTION, MAX_CELL_SIZE } from "@/global/constants";
import { Vector2, Vector3, Vector4 } from "threejs-math";


export const createCamera = (canvas: HTMLCanvasElement) => {
    // @dev position is the camera position in world space
    const position = new Vector3(0, 0, 50); // Z is zoom level
    const viewport = new Vector4(0, 0, 0, 0);
    const panSpeed = 0.0075;
    const minZoom = INTERACTION.MINZOOM;
    const maxZoom = INTERACTION.MAXZOOM;
    let rect = canvas.getBoundingClientRect();
    let cellSize = MAX_CELL_SIZE * (position.z / 100);

    const getPosition = () => position.clone();
    const getViewport = () => viewport.clone();
    const getCellSize = () => cellSize;

    const moveBy = (delta: Vector2) => {
        position.x += delta.x * panSpeed * 100/position.z;
        position.y += delta.y * panSpeed * 100/position.z;
    };

    const setPosition = (newPosition: Vector3) => {
        position.copy(newPosition);
    };

    const zoomBy = (delta: number): void => {
        const newZoom = position.z + delta;
        setZoom(newZoom);
    };

    const setZoom = (zoomLevel: number, centerPoint?: Vector2): void => {
        position.z = Math.max(Math.min(zoomLevel, maxZoom), minZoom);
        updateBoundingRect();
        calculateViewport();
        cellSize = MAX_CELL_SIZE * (position.z / 100);
        document.dispatchEvent(new Event("updateZoom"));
    };

    const cameraToWorld = (cameraPos: Vector2): Vector2 => {
        const worldX = (cameraPos.x - rect.width / 2) / position.z + position.x;
        const worldY = (cameraPos.y - rect.height / 2) / position.z + position.y;
        return new Vector2(worldX, worldY);
    };

    const worldToCamera = (worldPos: Vector2): Vector2 => {
        const cameraX = (worldPos.x - position.x) * position.z + rect.width / 2;
        const cameraY = (worldPos.y - position.y) * position.z + rect.height / 2;
        return new Vector2(cameraX, cameraY);
    };

    const updateBoundingRect = () => {
        rect = canvas.getBoundingClientRect();
    };

    // const applyTransform = (context: CanvasRenderingContext2D): void => {
    //     context.setTransform(position.z, 0, 0, position.z, rect.width / 2 - position.x * position.z, rect.height / 2 - position.y * position.z);
    // };

    // const resetTransform = (context: CanvasRenderingContext2D): void => {
    //     context.setTransform(1, 0, 0, 1, 0, 0);
    // };

    const calculateViewport = (): Vector4 => {
        const halfWidth = rect.width / 2 / position.z;
        const halfHeight = rect.height / 2 / position.z;
        viewport.set(
            position.x - halfWidth,
            position.y - halfHeight,
            position.x + halfWidth,
            position.y + halfHeight
        );
        cellSize = MAX_CELL_SIZE * (position.z / 100);
        return viewport;
    };

    const canvasToGrid = (point: Vector2) => {
        // @dev remove any canvas offsets
        point.sub(new Vector2(rect.left, rect.top));
        const worldPos = cameraToWorld(point);
        return new Vector2(Math.floor(worldPos.x), Math.floor(worldPos.y));
    };

    window.addEventListener("updateCanvas", updateBoundingRect);

    return {
        getPosition,
        getViewport,
        moveBy,
        setPosition,
        zoomBy,
        setZoom,
        cameraToWorld,
        worldToCamera,
        // applyTransform,
        // resetTransform,
        calculateViewport,
        canvasToGrid,
        getCellSize
    };
};