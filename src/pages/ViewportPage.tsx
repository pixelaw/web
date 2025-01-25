import SimpleColorPicker from "@/components/Viewport/ColorPicker/SimpleColorPicker.tsx"
import ParamDialog from "@/components/Viewport/ParamDialog/ParamDialog.tsx"
import { useDojoInteractHandler } from "@/hooks/useDojoInteractHandler.js"
import { usePixelawProvider } from "@/providers/PixelawProvider.js"
import { useSyncedViewStateStore, useViewStateStore } from "@/stores/ViewStateStore.ts"
import { useEffect, useMemo, useRef, useState } from "react"
import styles from "./ViewportPage.module.css"

const ViewportPage: React.FC = () => {
    //<editor-fold desc="State">
    const {
        pixelawCore: { viewPort },
        coreStatus,
    } = usePixelawProvider()
    const [paramDialogVisible, setParamDialogVisible] = useState(false)
    const [paramDialogParams, setParamDialogParams] = useState<unknown>(null)
    const [submitParamsCallback, setSubmitParamsCallback] = useState<(params: unknown) => void>(() => () => {})

    //</editor-fold>

    //<editor-fold desc="Hooks">

    const { color, center, setCenter, zoom } = useViewStateStore()

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

    //</editor-fold>

    //<editor-fold desc="Handlers">

    const zoombasedAdjustment = useMemo(() => {
        return zoom > 3000 ? "1rem" : "-100%"
    }, [zoom])

    //</editor-fold>

    //<editor-fold desc="Output">

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
            {/*<div className={styles.apps} style={{ left: zoombasedAdjustment }}>*/}
            {/*    <Apps appStore={appStore} />*/}
            {/*</div>*/}
            {paramDialogVisible && (
                <ParamDialog params={paramDialogParams} onSubmit={handleParamSubmit} onClose={closeParamDialog} />
            )}
        </>
    )

    //</editor-fold>
}

export default ViewportPage
