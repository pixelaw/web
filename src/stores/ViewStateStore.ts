import { DEFAULT_WORLD } from "@/global/constants.ts"
import { usePixelawProvider } from "@/providers/PixelawProvider.tsx"
import useSettingStore from "@/stores/SettingStore.ts"
import type { Coordinate } from "@/webtools/types.ts"
import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { create } from "zustand"

const ZOOM_PRESETS = { tile: 100, pixel: 7000 }
const DEFAULT_ZOOM = ZOOM_PRESETS.pixel
const DEFAULT_CENTER: Coordinate = [4294967194, 0]

interface AppState {
    selectedApp: string
    center: Coordinate
    zoom: number
    color: string
    world: string
    hoveredCell?: Coordinate
    clickedCell?: Coordinate
    setSelectedApp: (appName: string) => void
    setCenter: (center: Coordinate) => void
    setZoom: (zoom: number) => void
    setColor: (color: string) => void
    setHoveredCell: (cell?: Coordinate) => void
    setClickedCell: (cell?: Coordinate) => void
}

export const useViewStateStore = create<AppState>((set) => ({
    selectedApp: "",
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    color: "000000",
    world: DEFAULT_WORLD,
    hoveredCell: undefined,
    clickedCell: undefined,
    setSelectedApp: (appName: string) => set({ selectedApp: appName }),
    setCenter: (center: Coordinate) => set({ center }),
    setZoom: (zoom: number) => set({ zoom }),
    setColor: (color: string) => set({ color: color }),
    setWorld: (world: string) => set({ world: world }),
    setHoveredCell: (cell?: Coordinate) => set({ hoveredCell: cell }),
    setClickedCell: (cell?: Coordinate) => set({ clickedCell: cell }),
}))

export const ViewStateStore = () => {
    return {
        ...useViewStateStore.getState(),
        set: useViewStateStore.setState,
    }
}

export function useSyncedViewStateStore() {
    const location = useLocation()
    const { selectedApp, setSelectedApp, center, setCenter, zoom, setZoom, color, setColor } = useViewStateStore()

    const { setWorld, world } = useSettingStore()

    const initialLoad = useRef(true)

    // Initial load
    useEffect(() => {
        if (initialLoad.current) {
            initialLoad.current = false
            const queryParams = new URLSearchParams(location.search)
            const appInQuery = queryParams.get("app")
            const centerInQuery = queryParams.get("center")?.split(",").map(Number) as Coordinate
            const zoomInQuery = Number(queryParams.get("zoom"))
            const colorInQuery = queryParams.get("color")
            const worldInQuery = queryParams.get("world")

            if (appInQuery && appInQuery.length > 0) setSelectedApp(appInQuery)
            if (centerInQuery) setCenter(centerInQuery)
            if (zoomInQuery) setZoom(zoomInQuery)
            if (colorInQuery) setColor(colorInQuery)
            if (worldInQuery) setWorld(worldInQuery)
        }
    }, [setSelectedApp, setCenter, setZoom, setColor, location.search, setWorld])

    useEffect(() => {
        const updateURL = () => {
            const queryParams = new URLSearchParams()
            queryParams.set("app", selectedApp)
            queryParams.set("center", `${center[0]},${center[1]}`)
            queryParams.set("zoom", zoom.toString())
            queryParams.set("color", color)
            queryParams.set("world", world)
            const newSearch = `?${queryParams.toString()}`

            if (window.location.search !== newSearch) {
                window.history.replaceState(null, "", newSearch)
            }
        }
        updateURL()
    }, [selectedApp, center, zoom, color, world])
}
