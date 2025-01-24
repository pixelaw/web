import type { Bounds, Coordinate, Dimension } from "@/webtools/types/types.ts";
import { ZOOM_MAX, ZOOM_MIN, ZOOM_SCALEFACTOR, ZOOM_TILEMODE } from "./constants";
import { drawGrid } from "./drawGrid";
import { drawOutline } from "./drawOutline";
import { drawPixels } from "./drawPixels";
import { useViewStateStore } from "@/stores/ViewStateStore";
import { applyWorldOffset, areBoundsEqual, cellForPosition } from "@/webtools/utils";
import { drawTiles } from "./drawTiles";

export class _CanvasRenderer {
    isLoaded = () => this.ctx && this.bufferCtx;

    private eventListeners: [string, EventListener][] = [];

    dimensions: Dimension = [window.innerWidth, window.innerHeight];
    pixelOffset: Coordinate = [0, 0];
    worldOffset: Coordinate = [0, 0];
    hoveredCell: Coordinate | undefined;
    worldView: Bounds = [
        [0, 0],
        [0, 0],
    ];

    canvasRef: React.RefObject<HTMLCanvasElement>["current"] = null!;
    ctx: CanvasRenderingContext2D = null!;

    bufferCanvasRef: React.RefObject<HTMLCanvasElement>["current"] = null!;
    bufferCtx: CanvasRenderingContext2D = null!;

    init(canvasRef: React.RefObject<HTMLCanvasElement>, bufferCanvasRef: React.RefObject<HTMLCanvasElement>) {
        if (this.canvasRef) {
            for (const [event, listener] of this.eventListeners) {
                this.canvasRef.removeEventListener(event, listener);
            }
        }
        this.canvasRef = canvasRef.current;
        if (!canvasRef.current) {
            throw new Error("CanvasRenderer: canvasRef is null");
        }
        this.ctx = canvasRef.current?.getContext("2d")!;

        if (!bufferCanvasRef.current) {
            throw new Error("CanvasRenderer: bufferCanvasRef is null");
        }
        this.bufferCanvasRef = bufferCanvasRef.current;
        this.bufferCtx = bufferCanvasRef.current?.getContext("2d")!;
        const handlers = [
            ["mousedown", this.handleMouseDown],
            ["mousemove", this.handleMouseMove],
            ["mouseup", this.handleMouseUp],
            ["mouseleave", this.handleMouseLeave],
            ["wheel", this.handleWheel],
        ] as [keyof HTMLElementEventMap, EventListener][];
        for (const [event, handler] of handlers) {
            this.canvasRef.addEventListener(event, handler);
        }
    }

    prepareCanvas() {
        if (!this.isLoaded()) {
            return;
        }
        const { canvasRef, dimensions, ctx, bufferCtx } = this;
        const [width, height] = dimensions;
        // Set canvas
        canvasRef.width = width;
        canvasRef.height = height;
        ctx.imageSmoothingEnabled = false;

        bufferCtx.canvas.width = width;
        bufferCtx.canvas.height = height;
        bufferCtx.imageSmoothingEnabled = false;

        bufferCtx?.clearRect(0, 0, width, height);
    }

    calculateCenter() {
        const { zoom } = useViewStateStore.getState();
        const { pixelOffset, dimensions, worldOffset } = this;
        const [width, height] = dimensions;
        // Calculate the viewport's center point in pixels
        const viewportCenter: Coordinate = [width / 2, height / 2];
        // Adjust by pixelOffset to get the center in "world" pixels
        const adjustedCenter: Coordinate = [viewportCenter[0] + pixelOffset[0], viewportCenter[1] + pixelOffset[1]];
        // Convert to world coordinates (cells)
        const centerCell = cellForPosition(zoom, [0, 0], adjustedCenter);
        const worldCenterCell = applyWorldOffset(worldOffset, centerCell);
        return worldCenterCell;
    }

    getWorldViewBounds(): Bounds {
        const { zoom } = useViewStateStore.getState();
        const { pixelOffset, dimensions, worldOffset } = this;
        const [width, height] = dimensions;
        const topLeft = applyWorldOffset(worldOffset, [0, 0]);
        const bottomRightCell = cellForPosition(zoom, pixelOffset, [width, height]);
        const bottomRight = applyWorldOffset(worldOffset, bottomRightCell);
        return [topLeft, bottomRight];
    }

    onWorldViewChange() {
        const newWorldview = this.getWorldViewBounds();
        if (!areBoundsEqual(newWorldview, this.worldView)) {
            this.worldView = this.getWorldViewBounds();
            onWorldviewChange(newWorldview);
        }
    }

    handleWheel(e: WheelEvent) {
        e.preventDefault();
        const { canvasRef, pixelOffset } = this;
        const { setZoom, setCenter, zoom, center } = useViewStateStore.getState();

        const rect = canvasRef.getBoundingClientRect();
        let newZoom = zoom;

        if (e.deltaY < 0 && zoom < ZOOM_MAX) {
            // Zoom in
            newZoom *= ZOOM_SCALEFACTOR;
        } else if (e.deltaY > 0 && zoom > ZOOM_MIN) {
            // Zoom out
            newZoom /= ZOOM_SCALEFACTOR;
        }

        // Ensure newZoom is within bounds
        newZoom = Math.round(Math.min(Math.max(newZoom, ZOOM_MIN), ZOOM_MAX));

        // Calculate the mouse position relative to the canvas
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Convert mouse position to cell coordinates at the current zoom level
        const mouseCellBeforeZoom = cellForPosition(zoom, pixelOffset, [mouseX, mouseY]);

        // Calculate expected mouse cell position after zoom to keep it under the same world point
        const mouseCellAfterZoom = cellForPosition(newZoom, pixelOffset, [mouseX, mouseY]);

        // Calculate the difference in cell positions due to zooming
        const cellDiffX = mouseCellAfterZoom[0] - mouseCellBeforeZoom[0];
        const cellDiffY = mouseCellAfterZoom[1] - mouseCellBeforeZoom[1];

        // Update state with new zoom and world offset
        setZoom(newZoom);
        setCenter(center);

        // Adjust the worldOffset by the difference in cell positions
        // This keeps the content under the mouse stationary by adjusting the world offset
        setWorldOffset((currentWorldOffset) => [currentWorldOffset[0] + cellDiffX, currentWorldOffset[1] + cellDiffY]);
    }

    handleMouseDown(e: MouseEvent) {
      this.hoveredCell = undefined;
        setDragStart(Date.now());
        setHoveredCell(undefined);
        dragStartPoint.current = [e.clientX, e.clientY] as Coordinate;
        setLastDragPoint([e.clientX, e.clientY]);
    }

    handleMouseMove(e: MouseEvent) {
        e.preventDefault();
        throw new Error("Method not implemented.");
    }

    handleMouseLeave(e: MouseEvent) {
        e.preventDefault();
        throw new Error("Method not implemented.");
    }

    handleMouseUp(e: MouseEvent) {
        e.preventDefault();
        throw new Error("Method not implemented.");
    }

    render() {
        window.requestAnimationFrame(this.render);
        if (!this.isLoaded()) {
            return;
        }
        const { zoom } = useViewStateStore.getState();
        const { pixelOffset, dimensions, worldOffset, hoveredCell, bufferCanvasRef, bufferCtx, ctx, prepareCanvas } =
            this;

        // regular pixel rendering
        if (zoom > ZOOM_TILEMODE) {
            prepareCanvas();

            drawGrid(bufferCtx, zoom, pixelOffset, dimensions);

            // drawTiles(bufferContext, zoom, pixelOffset, dimensions, worldOffset, tileStore)

            drawPixels(bufferCtx, zoom, pixelOffset, dimensions, worldOffset, hoveredCell);

            drawOutline(bufferCtx, dimensions);

            ctx.drawImage(bufferCanvasRef.current, 0, 0);
        }

        // tile mode rendering
        if (zoom <= ZOOM_TILEMODE && zoom > ZOOM_MIN) {
            prepareCanvas();

            drawTiles(bufferCtx, zoom, pixelOffset, dimensions, worldOffset, tileset);
            drawOutline(bufferCtx, dimensions);

            ctx.drawImage(bufferCanvasRef.current, 0, 0);
        }
    }
}

const CanvasRenderer = new _CanvasRenderer();
export default CanvasRenderer;
