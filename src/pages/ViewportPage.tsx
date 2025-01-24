import Apps from "@/components/Viewport/Apps/Apps.tsx";
import SimpleColorPicker from "@/components/Viewport/ColorPicker/SimpleColorPicker.tsx";
import ParamDialog from "@/components/Viewport/ParamDialog/ParamDialog.tsx";
import { useDojoInteractHandler } from "@/hooks/useDojoInteractHandler.js";
import { usePixelawProvider } from "@/providers/PixelawProvider.js";
import { useDojoAppStore } from "@/stores/DojoAppStore.ts";
import { useSyncedViewStateStore, useViewStateStore } from "@/stores/ViewStateStore.ts";
import Viewport from "@/webtools/components/Viewport/ViewPort"; // Assuming this is the class-based component
import { useSimpleTileStore } from "@/webtools/hooks/SimpleTileStore.ts";
import { useUpdateService } from "@/core/UpdateService.ts";
import type { Bounds } from "@/webtools/types/types.ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./ViewportPage.module.css";
// import { PixelStore } from "@/stores/PixelStore";
import DojoSqlPixelStore from "@/core/dojo/DojoSqlPixelStore.ts";

const ViewportPage: React.FC = () => {
    //<editor-fold desc="State">

    const {  worldConfig } = usePixelawProvider()
    const [paramDialogVisible, setParamDialogVisible] = useState(false);
    const [paramDialogParams, setParamDialogParams] = useState<unknown>(null);
    const [submitParamsCallback, setSubmitParamsCallback] = useState<(params: unknown) => void>(() => () => {});

    //</editor-fold>

    //<editor-fold desc="Hooks">

    // if (clientError) return null;
    if (!worldConfig) return null;

    // const updateService = useUpdateService(worldConfig.serverUrl!);
    const appStore = useDojoAppStore();
    //
    // const pixelStore = DojoSqlPixelStore.getInstance(dojoStuff?.sdk!)
    //
    // pixelStore.refresh()
    // const tileStore = useSimpleTileStore(`${worldConfig.serverUrl}/tiles`);
    const { color, center, setCenter, zoom } = useViewStateStore();

    useSyncedViewStateStore();

    const handleParamsRequired = (params: unknown) => {
        setParamDialogParams(params);
        setParamDialogVisible(true);
    };

    const handleParamSubmit = (submittedParams: unknown) => {
        submitParamsCallback(submittedParams);
        setParamDialogVisible(false);
    };

    useDojoInteractHandler(handleParamsRequired, (submit) => {
        setSubmitParamsCallback(() => submit);
    });

    const closeParamDialog = () => {
        setParamDialogVisible(false);
    };

    //</editor-fold>

    //<editor-fold desc="Handlers">

    const zoombasedAdjustment = useMemo(() => {
        return zoom > 3000 ? "1rem" : "-100%";
    }, [zoom]);

    //</editor-fold>

    //<editor-fold desc="Output">

    const viewportContainerRef = useRef<HTMLDivElement | null>(null);
    const viewportRef = useRef<Viewport | null>(null);


    // useEffect(() => {
    //     const handleWorldViewChanged = (newWorldView: Bounds) => {
    //         pixelStore.prepare(newWorldView);
    //     };
    //
    //     // Subscribe to the worldViewChanged event
    //     viewportRef.current!.emitter.on('worldViewChanged', handleWorldViewChanged);
    //
    //     return () => {
    //         // Unsubscribe from the event when the component unmounts
    //         viewportRef.current!.emitter.off('worldViewChanged', handleWorldViewChanged);
    //     };
    // }, [pixelStore]);

    // useEffect(() => {
    //     if (!viewportContainerRef.current) return;
    //
    //     // Initialize the Viewport instance once
    //     viewportRef.current = new Viewport(
    //         viewportContainerRef.current,
    //         tileStore,
    //         pixelStore
    //     );
    //
    //     return () => {
    //         viewportRef.current?.destroy();
    //     };
    // }, []);

    // useEffect(() => {
    //     // Update properties without recreating the Viewport
    //     if (viewportRef.current) {
    //         viewportRef.current.updateZoom(zoom);
    //         viewportRef.current.updateCenter(center);
    //         viewportRef.current.updateTileset(tileStore.tileset);
    //     }
    // }, [zoom, center, tileStore.tileset]);
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
    );

    //</editor-fold>
};

export default ViewportPage;
