import React, { useEffect, useRef } from 'react'
import {clsx} from 'clsx'
import {useRenderGrid} from '@/hooks/useRenderGrid'
import {CANVAS_HEIGHT, CANVAS_WIDTH, INTERACTION, MAX_ROWS_COLS} from '@/global/constants'
import {useDrawPanel} from '@/providers/DrawPanelProvider.tsx'
import { getGameStore, useGameStore } from '@/global/user.store'
import { createUseGesture, dragAction, pinchAction, wheelAction } from '@use-gesture/react'

export type Coordinate = [number, number]

export type CellDatum = {
    coordinates: Array<number>
    hexColor: string
    text: string
}

export const deltaZoom = (delta:number) => {
    const newZoom = getGameStore().zoomLevel + delta;
    setZoom(newZoom);
}

export const setZoom = (zoomLevel:number) => {
    getGameStore().set({ zoomLevel: Math.max(Math.min(zoomLevel, INTERACTION.MAXZOOM), INTERACTION.MINZOOM) });
}


const DrawPanel = () => {
    const {
        cellSize,
        coordinates,
        selectedHexColor,
        data,
        panOffsetX,
        panOffsetY,
        setPanOffsetX,
        setPanOffsetY,
        onCellClick,
        onVisibleAreaCoordinate,
        onHover,
    } = useDrawPanel()

    //moving the canvas
    const [panning, setPanning] = React.useState<boolean>(false)

    const [initialPositionX, setInitialPositionX] = React.useState<number>(0)
    const [initialPositionY, setInitialPositionY] = React.useState<number>(0)

    // min: [x,y], [10,10]
    const visibleAreaXStart = Math.max(0, Math.floor(-panOffsetX / cellSize))
    const visibleAreaYStart = Math.max(0, Math.floor(-panOffsetY / cellSize))

    // max: [x,y]: [20,20]
    const visibleAreaXEnd = Math.min(MAX_ROWS_COLS, Math.ceil((CANVAS_WIDTH - panOffsetX) / cellSize))
    const visibleAreaYEnd = Math.min(MAX_ROWS_COLS, Math.ceil((CANVAS_HEIGHT - panOffsetY) / cellSize))

    // Add a new state for storing the mousedown time
    const [mouseDownTime, setMouseDownTime] = React.useState<number>(0)

    //render canvas grid
    const renderGrid = useRenderGrid()

    //canvas ref
    const gridCanvasRef = React.useRef<HTMLCanvasElement>()

    const notificationData = useGameStore((state) => state.notificationData);

    const focus = notificationData ? [notificationData] : []

    //It should be run one time only
    useEffect(() => {
        onVisibleAreaCoordinate?.([visibleAreaXStart, visibleAreaYStart], [visibleAreaXEnd, visibleAreaYEnd])
    }, [])

    useEffect(() => {
        if (gridCanvasRef.current) {
            const ctx = gridCanvasRef.current.getContext('2d', {willReadFrequently: true})
            if (!ctx) return

            renderGrid(ctx, {
                width: gridCanvasRef.current.width,
                height: gridCanvasRef.current.height,
                cellSize,
                coordinates,
                panOffsetX,
                panOffsetY,
                selectedHexColor,
                visibleAreaXStart,
                visibleAreaXEnd,
                visibleAreaYStart,
                visibleAreaYEnd,
                pixels: data,
                focus
            })
        }
    }, [coordinates, panOffsetX, panOffsetY, cellSize, selectedHexColor, data, renderGrid, visibleAreaXStart, visibleAreaXEnd, visibleAreaYStart, visibleAreaYEnd])

    const ref = React.useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handler = (e: Event) => {e.preventDefault()}
        document.addEventListener('gesturestart', handler)
        document.addEventListener('gesturechange', handler)
        document.addEventListener('gestureend', handler)
        
        return () => {
        document.removeEventListener('gesturestart', handler)
        document.removeEventListener('gesturechange', handler)
        document.removeEventListener('gestureend', handler)
        }
    }, [])
    
    const useGesture = createUseGesture([dragAction, pinchAction, wheelAction])
    useGesture(
        {
            // onMove: ({ event }) => console.log('move', event),
            onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
                if (pinching) return cancel()
                const offsetX = x - initialPositionX;
                const offsetY = y - initialPositionY;

                const maxOffsetX = -(MAX_ROWS_COLS * cellSize - CANVAS_WIDTH);
                const maxOffsetY = -(MAX_ROWS_COLS * cellSize - CANVAS_WIDTH);

                setPanOffsetX(offsetX > 0 ? 0 : Math.abs(offsetX) > Math.abs(maxOffsetX) ? maxOffsetX : offsetX)
                setPanOffsetY(offsetY > 0 ? 0 : Math.abs(offsetY) > Math.abs(maxOffsetY) ? maxOffsetY : offsetY)
            },
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
        scroll: { eventOptions: {capture: true} },
        pinch: { rubberband: true, eventOptions: {capture: true} },
        }
    )


    // function onClickCoordinates(x: number, clientY: number) {y
    //     if (!gridCanvasRef.current) return
    //     const rect = gridCanvasRef.current.getBoundingClientRect()
    //     const x = Math.abs(panOffsetX) + clientX - rect.left  // pixel
    //     const y = Math.abs(panOffsetY) + clientY - rect.top  // pixel

    //     const gridX = Math.floor(x / cellSize)
    //     const gridY = Math.floor(y / cellSize)

    //     onCellClick?.([gridX, gridY])
    // }

    // function onMouseLeave() {
    //     setPanning(false)

    //     onVisibleAreaCoordinate?.([visibleAreaXStart, visibleAreaYStart], [visibleAreaXEnd, visibleAreaYEnd])
    // }

    // function onMouseUp(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    //     setPanning(false)
    //     onVisibleAreaCoordinate?.([visibleAreaXStart, visibleAreaYStart], [visibleAreaXEnd, visibleAreaYEnd])

    //     // If the time difference between mouse down and up is less than a threshold (e.g., 200ms), it's a click
    //     if (Date.now() - mouseDownTime < 300) {
    //         onClickCoordinates(event.clientX, event.clientY)
    //     }
    // }

    // function onMouseDown(clientX: number, clientY: number) {
    //     setPanning(true)
    //     setInitialPositionX(clientX - panOffsetX)
    //     setInitialPositionY(clientY - panOffsetY)

    //     // Record the current time when mouse is down
    //     setMouseDownTime(Date.now())
    // }

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
            <div className={clsx([
                'w-full h-full pointer-events-none overflow-hidden touch-none',
            ])}>
                <div id={'canvas-container'} className={clsx([
                    `h-full w-full overflow-hidden pointer-events-auto touch-none`,
                ])} ref={ref}>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/*@ts-ignore*/}
                    <canvas ref={gridCanvasRef}
                            width={CANVAS_WIDTH}
                            height={CANVAS_HEIGHT}
                            className={clsx(['cursor-pointer pointer-events-none', {'!cursor-grab': panning}])}
                            // onMouseDown={(event) => onMouseDown(event.clientX, event.clientY)}
                            // onMouseMove={(event) => onMouseMove(event.clientX, event.clientY)}
                            // onMouseUp={(event) => onMouseUp(event)}
                            // onMouseLeave={onMouseLeave}
                    />
                </div>
            </div>
    )
}

export default DrawPanel
