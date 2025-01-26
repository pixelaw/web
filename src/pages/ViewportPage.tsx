import Apps from "@/components/Viewport/Apps/Apps.tsx"
import SimpleColorPicker from "@/components/Viewport/ColorPicker/SimpleColorPicker.tsx"
import { usePixelawProvider } from "@/providers/PixelawProvider.js"
import { useViewStateStore } from "@/stores/ViewStateStore.ts"
import { useEffect, useMemo, useRef } from "react"
import styles from "./ViewportPage.module.css"

const ViewportPage: React.FC = () => {
    const { pixelawCore, coreStatus } = usePixelawProvider()
    const { viewPort } = pixelawCore

    const { color, setColor, zoom } = useViewStateStore()

    // useSyncedViewStateStore()

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
                <SimpleColorPicker color={color} onColorSelect={setColor} />
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
