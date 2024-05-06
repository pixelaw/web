import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { CANVAS_HEIGHT, CANVAS_WIDTH, INTERACTION, MAP_SIZE, MAX_CELL_SIZE } from "@/global/constants";
import { useDrawPanel } from "@/providers/DrawPanelProvider.tsx";
import { getGameStore, useGameStore } from "@/global/game.store";
import { createUseGesture, dragAction, pinchAction, wheelAction, hoverAction, moveAction } from "@use-gesture/react";
import { renderGrid } from "@/hooks/useRenderGrid";

export type Coordinate = [number, number];

export type CellDatum = {
    coordinates: Array<number>;
    hexColor: string;
    text: string;
};

export const deltaZoom = (delta: number) => {
    const newZoom = getGameStore().zoomLevel.x + delta;
    setZoom(newZoom);
};

export const setZoom = (zoomLevel: number) => {
    const newZoom = Math.max(Math.min(zoomLevel || 50, INTERACTION.MAXZOOM), INTERACTION.MINZOOM);
    getGameStore().zoomLevel.x = newZoom;
};

const DrawPanel = () => {
    //canvas ref
    const gridCanvasRef = useRef<HTMLCanvasElement>(null!);
    
    const {
        coordinates,
        panOffset,
        onCellClick,
        onHover,
        grid,
    } = useDrawPanel();

    const [isPanning, setIsPanning] = React.useState<boolean>(false); // this is for displaying the hand cursor
    
    const [mouseDownTime, setMouseDownTime] = React.useState<number>(0); // Add a new state for storing the mousedown time

    useEffect(() => {
        let animationId: number;
        const render = () => {
            if (gridCanvasRef.current) {
                const ctx = gridCanvasRef.current.getContext("2d", { willReadFrequently: true });
                if (!ctx) return;
                renderGrid(ctx, {
                    canvas: gridCanvasRef,
                    coordinates,
                    panOffset,
                    grid,
                });
            }

            animationId = requestAnimationFrame(render);
        };
        animationId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationId);
    }, [
        gridCanvasRef,
        coordinates,
        grid,
    ]);

    // Cancel default gestures, use-gesture recommendation
    const ref = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
        };
        document.addEventListener("gesturestart", handler);
        document.addEventListener("gesturechange", handler);
        document.addEventListener("gestureend", handler);

        return () => {
            document.removeEventListener("gesturestart", handler);
            document.removeEventListener("gesturechange", handler);
            document.removeEventListener("gestureend", handler);
        };
    }, []);

    const useGesture = createUseGesture([dragAction, pinchAction, wheelAction, hoverAction, moveAction]);
    useGesture(
        {
            // onMove: ({ event }) => console.log('move', event),
            onMove: ({ dragging, event: { clientX, clientY } }) => {
                if (!gridCanvasRef.current || dragging) return;
                const cellSize = MAX_CELL_SIZE * (getGameStore().zoomLevel.x / 100);
                const rect = gridCanvasRef.current.getBoundingClientRect();
                const x = Math.abs(panOffset.x) + clientX - rect.left; // pixel
                const y = Math.abs(panOffset.y) + clientY - rect.top; // pixel

                const gridX = Math.floor(x / cellSize);
                const gridY = Math.floor(y / cellSize);
                onHover?.([gridX, gridY]);
            },
            onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
                if (pinching) return cancel();
                if (!isPanning) setIsPanning(true);
                const cellSize = MAX_CELL_SIZE * (getGameStore().zoomLevel.x / 100);
                const offsetX = x;
                const offsetY = y;

                const maxOffsetX = -(MAP_SIZE * cellSize - CANVAS_WIDTH);
                const maxOffsetY = -(MAP_SIZE * cellSize - CANVAS_WIDTH);

                panOffset.x = offsetX > 0 ? 0 : Math.abs(offsetX) > Math.abs(maxOffsetX) ? maxOffsetX : offsetX;
                panOffset.y = offsetY > 0 ? 0 : Math.abs(offsetY) > Math.abs(maxOffsetY) ? maxOffsetY : offsetY;
            },
            onDragEnd: () => setIsPanning(false),
            onPinch: ({ delta: [ds] }) => {
                deltaZoom(ds);
            },
            onWheel: ({ pinching, delta: [x, y], ...rest }) => {
                if (!pinching) {
                    const mod = 0.02;
                    deltaZoom(y * mod);
                }
            },
        },
        {
            target: ref,
            // Capture events to avoid bubbling into regular document events
            scroll: { rubberband: false, eventOptions: { capture: true } },
            pinch: { rubberband: false, eventOptions: { capture: true } },
        },
    );

    function onClickCoordinates(clientX: number, clientY: number) {
        if (!gridCanvasRef.current) return;
        const cellSize = MAX_CELL_SIZE * (getGameStore().zoomLevel.x / 100);
        const rect = gridCanvasRef.current.getBoundingClientRect();
        const x = Math.abs(panOffset.x) + clientX - rect.left; // pixel
        const y = Math.abs(panOffset.y) + clientY - rect.top; // pixel

        const gridX = Math.floor(x / cellSize);
        const gridY = Math.floor(y / cellSize);

        onCellClick?.([gridX, gridY]);
    }

    function onMouseUp(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        // If the time difference between mouse down and up is less than a threshold (e.g., 200ms), it's a click
        if (Date.now() - mouseDownTime < 300) {
            onClickCoordinates(event.clientX, event.clientY);
        }
    }

    function onMouseDown(clientX: number, clientY: number) {
        setMouseDownTime(Date.now());
    }

    // function onMouseHover(clientX: number, clientY: number) {
    //     if (!gridCanvasRef.current) return

    //     const rect = gridCanvasRef.current.getBoundingClientRect()
    //     const x = Math.abs(panOffsetX) + clientX - rect.left  // pixel
    //     const y = Math.abs(panOffsetY) + clientY - rect.top  // pixel

    //     const gridX = Math.floor(x / cellSize)
    //     const gridY = Math.floor(y / cellSize)

    //     // Now you have the grid coordinates on hover, you can use them as you need
    //     onHover?.([gridX, gridY])
    // }

    // function onMouseMove(clientX: number, clientY: number) {
    //     if (panning) {
    //         // this is a negative value
    //         const offsetX = clientX - initialPositionX;
    //         const offsetY = clientY - initialPositionY;

    //         const maxOffsetX = -(MAX_ROWS_COLS * cellSize - CANVAS_WIDTH); // Maximum allowed offset in X direction
    //         const maxOffsetY = -(MAX_ROWS_COLS * cellSize - CANVAS_WIDTH); // Maximum allowed offset in Y direction

    //         setPanOffsetX(offsetX > 0 ? 0 : Math.abs(offsetX) > Math.abs(maxOffsetX) ? maxOffsetX : offsetX)
    //         setPanOffsetY(offsetY > 0 ? 0 : Math.abs(offsetY) > Math.abs(maxOffsetY) ? maxOffsetY : offsetY)
    //     } else {
    //         onMouseHover(clientX, clientY)
    //     }
    // }

    return (
        <div className={clsx(["w-full h-full pointer-events-none overflow-hidden touch-none"])}>
            <div
                id={"canvas-container"}
                className={clsx([`h-full w-full overflow-hidden pointer-events-auto touch-none`])}
                ref={ref}
            >
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*@ts-ignore*/}
                <canvas
                    ref={gridCanvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className={clsx(["cursor-pointer pointer-events-auto", { "!cursor-grab": isPanning }])}
                    onMouseDown={(event) => onMouseDown(event.clientX, event.clientY)}
                    // onMouseMove={(event) => onMouseMove(event.clientX, event.clientY)}
                    onMouseUp={(event) => onMouseUp(event)}
                    onClick={(event) => onMouseUp(event)}
                />
            </div>
        </div>
    );
};

export default DrawPanel;
