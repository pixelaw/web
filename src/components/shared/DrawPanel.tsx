import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { CANVAS_HEIGHT, CANVAS_WIDTH, INTERACTION, MAP_SIZE, MAX_CELL_SIZE } from "@/global/constants";
import { useDrawPanel } from "@/providers/DrawPanelProvider.tsx";
import { getGameStore } from "@/global/game.store";
import { createUseGesture, dragAction, pinchAction, wheelAction, hoverAction, moveAction } from "@use-gesture/react";

export const deltaZoom = (delta: number) => {
    const newZoom = getGameStore().zoomLevel.x + delta;
    setZoom(newZoom);
};

export const setZoom = (zoomLevel: number) => {
    const newZoom = Math.max(Math.min(zoomLevel || 50, INTERACTION.MAXZOOM), INTERACTION.MINZOOM);
    if (newZoom !== getGameStore().zoomLevel.x) {
        getGameStore().zoomLevel.x = newZoom;
        document.dispatchEvent(new Event("updateZoom"));
    }
};

const DrawPanel = () => {
    const { setCanvasRef, onCellClick, onHover } = useDrawPanel();

    // pass canvas ref to context
    const gridCanvasRef = useRef<HTMLCanvasElement>(null!);

    useEffect(() => {
        setCanvasRef(gridCanvasRef);
    }, [gridCanvasRef, setCanvasRef]);

    const [isPanning, setIsPanning] = React.useState<boolean>(false); // this is for displaying the hand cursor

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
            onClick: ({event: {clientX, clientY}}) => {
                if (!gridCanvasRef.current) return;
                const panOffset = getGameStore().panOffset;
                const cellSize = MAX_CELL_SIZE * (getGameStore().zoomLevel.x / 100);
                const rect = gridCanvasRef.current.getBoundingClientRect();
                const x = Math.abs(panOffset.x) + clientX - rect.left; // pixel
                const y = Math.abs(panOffset.y) + clientY - rect.top; // pixel
        
                const gridX = Math.floor(x / cellSize);
                const gridY = Math.floor(y / cellSize);
        
                onCellClick?.([gridX, gridY]);
            },
            onMove: ({ dragging, event: { clientX, clientY } }) => {
                if (!gridCanvasRef.current || dragging) return;
                const panOffset = getGameStore().panOffset;
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
                const panOffset = getGameStore().panOffset;
                const cellSize = MAX_CELL_SIZE * (getGameStore().zoomLevel.x / 100);
                const offsetX = x;
                const offsetY = y;

                const maxOffsetX = -(MAP_SIZE * cellSize - CANVAS_WIDTH);
                const maxOffsetY = -(MAP_SIZE * cellSize - CANVAS_WIDTH);

                panOffset.x = x;//offsetX > 0 ? 0 : Math.abs(offsetX) > Math.abs(maxOffsetX) ? maxOffsetX : offsetX;
                panOffset.y = y;//offsetY > 0 ? 0 : Math.abs(offsetY) > Math.abs(maxOffsetY) ? maxOffsetY : offsetY;
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
                />
            </div>
        </div>
    );
};

export default DrawPanel;
