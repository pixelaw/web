import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { CANVAS_HEIGHT, CANVAS_WIDTH, INTERACTION, MAX_CELL_SIZE } from "@/global/constants";
import { useDrawPanel } from "@/providers/DrawPanelProvider.tsx";
import { getGameStore } from "@/global/game.store";
import { createUseGesture, dragAction, pinchAction, wheelAction, hoverAction, moveAction } from "@use-gesture/react";
import { Vector2 } from "threejs-math";

type TMouseMemo = {
    isPanning: boolean | undefined;
    mouseDownPosition: Vector2 | undefined;
};

const DrawPanel = () => {
    const { setCanvas, onCellClick, onHover, camera } = useDrawPanel();
    const gridCanvasRef = useRef<HTMLCanvasElement>(null!);

    // @dev Hook up canvas ref to DrawPanelProvider
    useEffect(() => {
        setCanvas(gridCanvasRef);
    }, [gridCanvasRef, setCanvas]);

    // @dev Cancel default gestures, use-gesture recommendation
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

    // @dev Store mouse data
    const [mouseMemo, setMouseMemo] = React.useState<TMouseMemo>({
        isPanning: undefined,
        mouseDownPosition: undefined,
    });

    createUseGesture([dragAction, pinchAction, wheelAction, hoverAction, moveAction])(
        {
            onMouseDown: ({ event: { clientX, clientY } }) => {
                const memo = {
                    mouseDownPosition: new Vector2(clientX, clientY),
                };
                setMouseMemo({ ...mouseMemo, ...memo });
            },
            onClick: ({ event: { clientX, clientY }, ...rest }) => {
                if (!gridCanvasRef.current || mouseMemo.isPanning) return;
                const mousePos = new Vector2(clientX, clientY);
                if (mouseMemo.mouseDownPosition && mousePos.distanceTo(mouseMemo.mouseDownPosition) > 1) {
                    return;
                }
                const pos = camera.canvasToGrid(new Vector2(clientX, clientY));
                onCellClick?.([pos.x, pos.y]);
            },
            onMove: ({ dragging, event: { clientX, clientY } }) => {
                if (!gridCanvasRef.current || dragging) return;
                const pos = camera.canvasToGrid(new Vector2(clientX, clientY));
                onHover?.([pos.x, pos.y]);
            },
            onDrag: ({ pinching, cancel, offset: [x, y], delta: [dx, dy], ...rest }) => {
                if (pinching) return cancel();
                if (mouseMemo.isPanning === undefined) setMouseMemo({ ...mouseMemo, ...{ isPanning: true } });
                camera.moveBy(new Vector2(dx, dy));

            },
            onDragEnd: () => setMouseMemo({ ...mouseMemo, ...{ isPanning: false } }),
            onPinch: ({ delta: [ds] }) => {
                camera.zoomBy(ds);
            },
            onWheel: ({ pinching, delta: [x, y], ...rest }) => {
                if (!pinching) {
                    const mod = 0.02;
                    camera.zoomBy(y * mod);
                }
            },
        },
        {
            target: ref,
            // @dev Capture events to avoid bubbling into regular document events
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
                <canvas
                    ref={gridCanvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className={clsx("cursor-pointer pointer-events-auto", mouseMemo.isPanning && "cursor-grab")}
                    // TODO: implement onResize scaling
                />
            </div>
        </div>
    );
};

export default DrawPanel;
