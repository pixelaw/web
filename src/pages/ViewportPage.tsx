import Apps from "@/components/Viewport/Apps/Apps.tsx"
import SimpleColorPicker from "@/components/Viewport/ColorPicker/SimpleColorPicker.tsx"
import { usePixelawProvider } from "@/providers/PixelawProvider.js"
import { useSyncedViewStateStore, useViewStateStore } from "@/stores/ViewStateStore.ts"
import type { Coordinate } from "@/webtools/types/types.ts"
import { useEffect, useMemo, useRef } from "react"
import styles from "./ViewportPage.module.css"

const ViewportPage: React.FC = () => {
    const { pixelawCore, coreStatus } = usePixelawProvider()
    const { viewPort, appStore } = pixelawCore

    const { color, center, setCenter, zoom, setZoom } = useViewStateStore()

    useEffect(() => {
        if (viewPort) viewPort.setZoom(zoom)
    }, [zoom, viewPort])

    useEffect(() => {
        if (viewPort) viewPort.setCenter(center)
    }, [center, viewPort])

    // Handle changes from inside ViewPort
    useEffect(() => {
        const handleZoomChange = (newZoom: number) => {
            setZoom(newZoom)
        }
        const handleCenterChange = (newCenter: Coordinate) => {
            setCenter(newCenter)
        }

        pixelawCore.events.on("zoomChanged", handleZoomChange)
        pixelawCore.events.on("centerChanged", handleCenterChange)

        return () => {
            pixelawCore.events.off("zoomChanged", handleZoomChange)
            pixelawCore.events.off("centerChanged", handleCenterChange)
        }
    }, [pixelawCore, setZoom, setCenter])

    useSyncedViewStateStore()
    //
    // const handleParamsRequired = (params: unknown) => {
    //     setParamDialogParams(params)
    //     setParamDialogVisible(true)
    // }
    //
    // const handleParamSubmit = (submittedParams: unknown) => {
    //     submitParamsCallback(submittedParams)
    //     setParamDialogVisible(false)
    // }
    //
    // useDojoInteractHandler(handleParamsRequired, (submit) => {
    //     setSubmitParamsCallback(() => submit)
    // })
    //
    // const closeParamDialog = () => {
    //     setParamDialogVisible(false)
    // }

    const zoombasedAdjustment = useMemo(() => {
        return zoom > 3000 ? "1rem" : "-100%"
    }, [zoom])

    const viewportContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (coreStatus !== "ready") return

        viewPort.setContainer(viewportContainerRef.current!)
    }, [coreStatus, viewPort])

    return (
        <>
            <div ref={viewportContainerRef} style={{ width: "100%", height: "100%" }} />
            <div className={styles.colorpicker} style={{ bottom: zoombasedAdjustment }}>
                <SimpleColorPicker color={color} onColorSelect={useViewStateStore.getState().setColor} />
            </div>
            <div className={styles.apps} style={{ left: zoombasedAdjustment }}>
                <Apps />
            </div>
            {/*{paramDialogVisible && (*/}
            {/*    <ParamDialog params={paramDialogParams} onSubmit={handleParamSubmit} onClose={closeParamDialog} />*/}
            {/*)}*/}
        </>
    )

    //</editor-fold>
}

export default ViewportPage
