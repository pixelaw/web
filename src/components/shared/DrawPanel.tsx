import React, { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/global/constants";
import { useDrawPanel } from "@/providers/DrawPanelProvider.tsx";
import { createUseGesture, dragAction, pinchAction, wheelAction, hoverAction, moveAction } from "@use-gesture/react";
import { Vector2 } from "threejs-math";

type TMouseMemo = {
    isPanning: boolean | undefined;
    mouseDownPosition: Vector2 | undefined;
};

const DrawPanel = () => {
    const [canvasDimensions, setCanvasDimensions] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    const { setCanvas, onCellClick, onHover, camera } = useDrawPanel();
    const canvasRef = useRef<HTMLCanvasElement>(null!);

    // @dev Hook up canvas ref to DrawPanelProvider
    useEffect(() => {
        setCanvas(canvasRef);
    }, [canvasRef, setCanvas]);

    const ref = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        // @dev Cancel default gestures, use-gesture recommendation
        const handler = (e: Event) => {
            e.preventDefault();
        };

        // @dev Handle resize of canvas
        const handleResize = () => {
            if (canvasRef.current) {
                const { clientWidth, clientHeight } = canvasRef.current.parentElement!;
                setCanvasDimensions({ width: clientWidth, height: clientHeight });
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        document.addEventListener("gesturestart", handler);
        document.addEventListener("gesturechange", handler);
        document.addEventListener("gestureend", handler);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("gesturestart", handler);
            document.removeEventListener("gesturechange", handler);
            document.removeEventListener("gestureend", handler);
        };
    }, []);

    // @dev Handle resize of canvas
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = canvasDimensions.width;
            canvas.height = canvasDimensions.height;
            window.dispatchEvent(new Event("updateCanvas"));
        }
    }, [canvasDimensions]);

    // @dev Store mouse data
    const [mouseMemo, setMouseMemo] = React.useState<TMouseMemo>({
        isPanning: undefined,
        mouseDownPosition: undefined,
    });

    createUseGesture([dragAction, pinchAction, wheelAction, hoverAction, moveAction])(
        {
            onMouseDown: ({ event: { clientX, clientY } }) => {
                // @dev Track mousedown, disable click on panning
                const memo = {
                    mouseDownPosition: new Vector2(clientX, clientY),
                };
                setMouseMemo({ ...mouseMemo, ...memo });
            },
            onClick: ({ event: { clientX, clientY }, ...rest }) => {
                if (!canvasRef.current || mouseMemo.isPanning) return;
                const mousePos = new Vector2(clientX, clientY);
                if (mouseMemo.mouseDownPosition && mousePos.distanceTo(mouseMemo.mouseDownPosition) > 1) {
                    return;
                }
                const pos = camera.canvasToGrid(new Vector2(clientX, clientY));
                onCellClick?.([pos.x, pos.y]);
            },
            onMove: ({ dragging, event: { clientX, clientY } }) => {
                if (!canvasRef.current || dragging) return;
                const pos = camera.canvasToGrid(new Vector2(clientX, clientY));
                onHover?.([pos.x, pos.y]);
            },
            onDrag: ({ pinching, cancel, offset: [x, y], delta: [dx, dy], ...rest }) => {
                if (pinching) return cancel();
                if (mouseMemo.isPanning === undefined) setMouseMemo({ ...mouseMemo, ...{ isPanning: true } });
                // @dev inverted because drag movement
                camera.moveBy(new Vector2(-dx, -dy));
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
        <div className={clsx(["w-full h-full pointer-events-none overflow-hidden touch-none overscroll-none"])}>
            <div
                id={"canvas-container"}
                className={clsx([`h-full w-full overflow-hidden pointer-events-none touch-none overscroll-none `])}
                ref={ref}
            >
                <canvas
                    ref={canvasRef}
                    width={canvasDimensions.width}
                    height={canvasDimensions.height}
                    className={clsx(
                        "cursor-pointer pointer-events-auto",
                        mouseMemo.isPanning && "cursor-grab overflow-hidden",
                    )}
                />
            </div>
        </div>
    );
};

export default DrawPanel;
