import type { Bounds, Coordinate, TileStore } from "../../types/types.ts"
import { applyWorldOffset, cellForPosition, getCellSize, handlePixelChanges } from "../../utils.ts"
import { ZOOM_MAX, ZOOM_MIN, ZOOM_SCALEFACTOR, ZOOM_TILEMODE } from "./constants.ts"
import { drawGrid } from "./drawGrid.ts"
import { drawOutline } from "./drawOutline.ts"
import { drawPixels } from "./drawPixels.ts"
import { drawTiles } from "./drawTiles.ts"

import type { PixelStore } from "@/core/PixelStore.types.ts"
import type { PixelCoreEvents } from "@/core/types.ts"
import type { Emitter } from "mitt"

export class Viewport {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D | null
    private bufferCanvas: HTMLCanvasElement
    private bufferContext: CanvasRenderingContext2D | null
    private pixelOffset: Coordinate = [0, 0]
    private worldOffset: Coordinate = [0, 0]
    private hoveredCell: Coordinate | undefined
    private worldView: Bounds = [
        [0, 0],
        [0, 0],
    ]
    private lastDragPoint: Coordinate = [0, 0]
    private dragStart = 0
    private dragStartPoint: Coordinate | null = null
    private tileStore: TileStore
    private pixelStore: PixelStore
    private zoom = 2000
    private center: Coordinate
    private pixelCoreEvents: Emitter<PixelCoreEvents>

    constructor(pixelCoreEvents: Emitter<PixelCoreEvents>, tileStore: TileStore, pixelStore: PixelStore) {
        this.canvas = document.createElement("canvas")
        this.context = this.canvas.getContext("2d")
        this.bufferCanvas = document.createElement("canvas")
        this.bufferContext = this.bufferCanvas.getContext("2d")
        this.tileStore = tileStore
        this.pixelStore = pixelStore
        this.pixelCoreEvents = pixelCoreEvents

        this.setupEventListeners()
        this.subscribeToEvents()
        this.render()
    }

    public setContainer(container: HTMLElement) {
        this.canvas.width = container.clientWidth
        this.canvas.height = container.clientHeight
        container.appendChild(this.canvas)
        this.render()
    }

    private subscribeToEvents() {
        this.pixelCoreEvents.on("pixelStoreUpdated", (timestamp: number) => {
            console.log(`pixelStoreUpdated at: ${timestamp}`)

            this.render()
        })
        this.pixelCoreEvents.on("tileStoreUpdated", (timestamp: number) => {
            console.log(`tileStoreUpdated at: ${timestamp}`)

            this.render()
        })
    }

    private setupEventListeners() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
        this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
        this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this))
        this.canvas.addEventListener("wheel", this.handleWheel.bind(this), { passive: false })
    }

    private handleMouseDown(event: MouseEvent) {
        console.log("handleMouseDown")
        this.dragStart = Date.now()
        this.hoveredCell = undefined
        this.dragStartPoint = [event.clientX, event.clientY]
        this.lastDragPoint = [event.clientX, event.clientY]
    }

    private handleMouseMove(event: MouseEvent) {
        if (this.dragStart) {
            const mouse: Coordinate = [event.clientX, event.clientY]
            this.drag(this.lastDragPoint, mouse)
            this.lastDragPoint = mouse
        } else {
            // Handle hover logic
        }
    }

    private handleMouseUp(event: MouseEvent) {
        let distance = 0
        if (this.dragStartPoint !== null) {
            const startPos = this.dragStartPoint
            const endPos: Coordinate = [event.clientX, event.clientY]
            distance = Math.sqrt((endPos[0] - startPos[0]) ** 2 + (endPos[1] - startPos[1]) ** 2)
        }

        const timeDiff = Date.now() - this.dragStart
        if (timeDiff < 500 && distance < 10) {
            const rect = this.canvas.getBoundingClientRect()
            const viewportCell = cellForPosition(this.zoom, this.pixelOffset, [
                event.clientX - rect.left,
                event.clientY - rect.top,
            ])
            const worldClicked = applyWorldOffset(this.worldOffset, viewportCell)

            this.pixelCoreEvents.emit("cellClicked", worldClicked)
        } else {
            const mouse: Coordinate = [event.clientX, event.clientY]
            this.drag(this.lastDragPoint, mouse)
        }

        this.setCenter(this.calculateCenter())
        this.dragStart = 0
        this.dragStartPoint = null
    }

    private handleWheel(event: WheelEvent) {
        event.preventDefault()
        // this.pixelStore.updateCache();   // TODO
        const rect = this.canvas.getBoundingClientRect()
        let newZoom = this.zoom

        if (event.deltaY < 0 && this.zoom < ZOOM_MAX) {
            newZoom *= ZOOM_SCALEFACTOR
        } else if (event.deltaY > 0 && this.zoom > ZOOM_MIN) {
            newZoom /= ZOOM_SCALEFACTOR
        }

        newZoom = Math.round(Math.min(Math.max(newZoom, ZOOM_MIN), ZOOM_MAX))

        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        const mouseCellBeforeZoom = cellForPosition(this.zoom, this.pixelOffset, [mouseX, mouseY])
        const mouseCellAfterZoom = cellForPosition(newZoom, this.pixelOffset, [mouseX, mouseY])

        const cellDiffX = mouseCellAfterZoom[0] - mouseCellBeforeZoom[0]
        const cellDiffY = mouseCellAfterZoom[1] - mouseCellBeforeZoom[1]

        this.setZoom(newZoom)
        this.setCenter(this.center)

        this.worldOffset = [this.worldOffset[0] + cellDiffX, this.worldOffset[1] + cellDiffY]
    }

    private render() {
        if (!this.context || !this.bufferContext) return

        this.prepareCanvas()
        console.log(
            "zoom",
            this.zoom,
            "po",
            this.pixelOffset,
            "wh",
            [this.canvas.width, this.canvas.height],
            "wo",
            this.worldOffset,
        )

        drawGrid(this.bufferContext, this.zoom, this.pixelOffset, [this.canvas.width, this.canvas.height])
        drawTiles(
            this.bufferContext,
            this.zoom,
            this.pixelOffset,
            [this.canvas.width, this.canvas.height],
            this.worldOffset,
            this.tileStore.tileset!,
        )
        drawPixels(
            this.bufferContext,
            this.zoom,
            this.pixelOffset,
            [this.canvas.width, this.canvas.height],
            this.worldOffset,
            this.hoveredCell,
            this.pixelStore,
        )
        drawOutline(this.bufferContext, [this.canvas.width, this.canvas.height])
        this.context.drawImage(this.bufferCanvas, 0, 0)
        console.log("render")
    }

    private prepareCanvas() {
        const width = this.canvas.width
        const height = this.canvas.height

        if (!this.context || !this.bufferContext) return

        this.canvas.width = width
        this.canvas.height = height
        this.context.imageSmoothingEnabled = false

        this.bufferCanvas.width = width
        this.bufferCanvas.height = height
        this.bufferContext.imageSmoothingEnabled = false

        this.bufferContext.clearRect(0, 0, width, height)
    }

    private calculateCenter(): Coordinate {
        const width = this.canvas.width
        const height = this.canvas.height
        const viewportCenter: Coordinate = [width / 2, height / 2]
        const adjustedCenter: Coordinate = [
            viewportCenter[0] + this.pixelOffset[0],
            viewportCenter[1] + this.pixelOffset[1],
        ]
        const centerCell = cellForPosition(this.zoom, [0, 0], adjustedCenter)
        return applyWorldOffset(this.worldOffset, centerCell)
    }

    private drag(lastDragPoint: Coordinate, mouse: Coordinate) {
        const cellWidth = getCellSize(this.zoom)
        const [newPixelOffset, newWorldOffset] = handlePixelChanges(
            [...this.pixelOffset],
            [...this.worldOffset],
            [lastDragPoint[0] - mouse[0], lastDragPoint[1] - mouse[1]],
            cellWidth,
        )

        this.pixelOffset = newPixelOffset
        this.worldOffset = newWorldOffset
    }

    private setZoom(newZoom: number) {
        this.zoom = newZoom
        this.pixelCoreEvents.emit("zoomChanged", newZoom)
    }

    private setCenter(newCenter: Coordinate) {
        this.center = newCenter
        this.pixelCoreEvents.emit("centerChanged", newCenter)
    }

    private setWorldView(newBounds: Bounds) {
        this.worldView = newBounds
        this.pixelCoreEvents.emit("worldViewChanged", newBounds)
    }

    public destroy() {
        this.canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this))
        this.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this))
        this.canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this))
        this.canvas.removeEventListener("wheel", this.handleWheel.bind(this))
    }
}

export default Viewport
