import styles from './App.module.css';
import React, {useEffect, useMemo} from "react";
import {Bounds, Coordinate} from "@/webtools/types.ts";
import {useSimpleTileStore} from "@/webtools/hooks/SimpleTileStore.ts";
import {useDojoPixelStore} from "@/stores/DojoPixelStore.ts";
import {useUpdateService} from "@/webtools/hooks/UpdateService.ts";
import Viewport from "@/webtools/components/Viewport/ViewPort.tsx";
import SimpleColorPicker from "@/components/ColorPicker/SimpleColorPicker.tsx";
import MenuBar from "@/components/MenuBar/MenuBar.tsx";
import Apps from "@/components/Apps/Apps.tsx";
import {useDojoAppStore} from "@/stores/DojoAppStore.ts";
import {Route, Routes} from "react-router-dom";
import Loading from "@/components/Loading/Loading.tsx";
import Settings from "@/components/Settings/Settings.tsx";
import {usePixelawProvider} from "@/providers/PixelawProvider.tsx";
import {useViewStateStore, useSyncedViewStateStore} from "@/stores/ViewStateStore.ts";
import {useDojoInteractHandler} from "@/hooks/useDojoInteractHandler.ts";
import {useSettingsStore} from "@/stores/SettingsStore.ts";

function App() {
    // console.log("App")
    //<editor-fold desc="State">


    //</editor-fold>

    //<editor-fold desc="Hooks">
    const settings = useSettingsStore()

    // console.log("serverUrl", settings.config?.serverUrl)

    const updateService = useUpdateService(settings.config?.serverUrl!)
    const pixelStore = useDojoPixelStore(settings.config?.toriiUrl!);
    const tileStore = useSimpleTileStore(`${settings.config?.serverUrl}/tiles`)
    const appStore = useDojoAppStore();
    const {clientState, error, gameData} = usePixelawProvider();
    const {
        color,
        setColor,
        center,
        setCenter,
        zoom,
        setZoom,
        setHoveredCell,
        setClickedCell
    } = useViewStateStore();

    useDojoInteractHandler(pixelStore, gameData!);
    useSyncedViewStateStore();
    //</editor-fold>

    //<editor-fold desc="Handlers">
    useEffect(() => {
        if(!updateService.tileChanged) return
        console.log("updateService.tileChanged", updateService.tileChanged)
        tileStore.fetchTile(updateService.tileChanged!.tileName)
        pixelStore.refresh()
    }, [updateService.tileChanged]);

    function onWorldviewChange(newWorldview: Bounds) {
        // console.log("onWorldviewChange", newWorldview)
        updateService.setBounds(newWorldview)
        pixelStore.prepare(newWorldview)
        tileStore.prepare(newWorldview)
    }

    function onCellHover(coordinate: Coordinate | undefined) {
        // TODO this is where we'll do some p2p social stuff
        setHoveredCell(coordinate)
    }

    function onCellClick(coordinate: Coordinate) {
        setClickedCell(coordinate)
    }

    function onColorSelect(color: string) {
        // remove the leading #
        color = color.replace('#', '')
        setColor(color)
    }

    //</editor-fold>

    //<editor-fold desc="Custom behavior">

    // TODO "slide up" the bottom as the zoomlevel increases
    const zoombasedAdjustment = useMemo(() => {
        if (zoom > 3000) {
            return '1rem';
        }
        return '-100%';
    }, [zoom]);

    //</editor-fold>

    //<editor-fold desc="Output">
    if (clientState === "loading") {
        document.title = "PixeLAW: Loading";
        return <Loading/>;
    }

    if (clientState === "error") {
        document.title = "PixeLAW: Error";
        const errorMessage = `${error}`
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorMessage}>
                    <h1 className={styles.errorTitle}>
                        Something went wrong
                    </h1>
                    {errorMessage !== '' &&
                        <p className={styles.errorDetail}>
                            {errorMessage}
                        </p>
                    }
                    <p className={styles.errorSuggestion}>
                        Try to refresh this page. If issue still persists, alert the team at Discord.
                    </p>
                </div>
            </div>
        );
    }

    document.title = "PixeLAW: World";

    return (
        <div className={styles.container}>
            <MenuBar/>

            <div className={styles.main}>

                <Routes>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/" element={
                        <>
                            <Viewport
                                tileset={tileStore.tileset!}
                                pixelStore={pixelStore}
                                zoom={zoom}
                                setZoom={setZoom}
                                center={center}
                                setCenter={setCenter}
                                onWorldviewChange={onWorldviewChange}
                                onCellClick={onCellClick}
                                onCellHover={onCellHover}
                            />
                            <div className={styles.colorpicker} style={{bottom: zoombasedAdjustment}}>
                                <SimpleColorPicker color={color} onColorSelect={onColorSelect}/>
                            </div>

                            <div className={styles.apps} style={{left: zoombasedAdjustment}}>
                                <Apps
                                    appStore={appStore}
                                />
                            </div>
                        </>
                    }/>

                </Routes>
            </div>
        </div>
    )
    //</editor-fold>
}


export default App
