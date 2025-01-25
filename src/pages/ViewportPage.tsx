import SimpleColorPicker from "@/components/Viewport/ColorPicker/SimpleColorPicker.tsx"
import ParamDialog from "@/components/Viewport/ParamDialog/ParamDialog.tsx"
import { useDojoInteractHandler } from "@/hooks/useDojoInteractHandler.js"
import { usePixelawProvider } from "@/providers/PixelawProvider.js"
import { useDojoAppStore } from "@/stores/DojoAppStore.ts"
import { useSyncedViewStateStore, useViewStateStore } from "@/stores/ViewStateStore.ts"
import type Viewport from "@/webtools/components/Viewport/ViewPort"
import { useEffect, useMemo, useRef, useState } from "react"
import styles from "./ViewportPage.module.css"

const ViewportPage: React.FC = () => {
    //<editor-fold desc="State">
    const {
        worldConfig,
        pixelawCore: { viewPort },
        coreStatus,
    } = usePixelawProvider()
    const [paramDialogVisible, setParamDialogVisible] = useState(false)
    const [paramDialogParams, setParamDialogParams] = useState<unknown>(null)
    const [submitParamsCallback, setSubmitParamsCallback] = useState<(params: unknown) => void>(() => () => {})

    //</editor-fold>

    //<editor-fold desc="Hooks">

    // if (clientError) return null;
    // if (!worldConfig) return null

    // const updateService = useUpdateService(worldConfig.serverUrl!);
    const appStore = useDojoAppStore()
    //
    // const pixelStore = DojoSqlPixelStore.getInstance(dojoStuff?.sdk!)
    //
    // pixelStore.refresh()
    // const tileStore = useSimpleTileStore(`${worldConfig.serverUrl}/tiles`);
    const { color, center, setCenter, zoom } = useViewStateStore()

    useSyncedViewStateStore()

    const handleParamsRequired = (params: unknown) => {
        setParamDialogParams(params)
        setParamDialogVisible(true)
    }

    const handleParamSubmit = (submittedParams: unknown) => {
        submitParamsCallback(submittedParams)
        setParamDialogVisible(false)
    }

    useDojoInteractHandler(handleParamsRequired, (submit) => {
        setSubmitParamsCallback(() => submit)
    })

    const closeParamDialog = () => {
        setParamDialogVisible(false)
    }

    //</editor-fold>

    //<editor-fold desc="Handlers">

    const zoombasedAdjustment = useMemo(() => {
        return zoom > 3000 ? "1rem" : "-100%"
    }, [zoom])

    //</editor-fold>

    //<editor-fold desc="Output">

    const viewportContainerRef = useRef<HTMLDivElement | null>(null)
    // const viewportRef = useRef<Viewport | null>(null)
    console.log("viewPort", viewPort)

    useEffect(() => {
        // if (coreStatus === "ready")
        // if (!viewPort || !viewportContainerRef.current) return
        // viewPort.setContainer(viewportContainerRef.current)
        console.log("aa", coreStatus)
    }, [coreStatus])

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
