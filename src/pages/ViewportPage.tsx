import styles from './ViewportPage.module.css';
import React, {useEffect, useMemo} from "react";
import {Bounds, Coordinate} from "@/webtools/types.ts";
import {useSimpleTileStore} from "@/webtools/hooks/SimpleTileStore.ts";
import {useDojoPixelStore} from "@/stores/DojoPixelStore.ts";
import {useUpdateService} from "@/webtools/hooks/UpdateService.ts";
import Viewport from "@/webtools/components/Viewport/ViewPort.tsx";
import SimpleColorPicker from "@/components/ColorPicker/SimpleColorPicker.tsx";
import Apps from "@/components/Apps/Apps.tsx";
import {useDojoAppStore} from "@/stores/DojoAppStore.ts";
import {useSyncedViewStateStore, useViewStateStore} from "@/stores/ViewStateStore.ts";
import {useSettingsStore} from "@/stores/SettingsStore.ts";
import {useDojoInteractHandler} from "@/hooks/useDojoInteractHandler.js";
import {usePixelawProvider} from "@/providers/PixelawProvider.js";

const ViewportPage: React.FC = () => {
    const {clientState, error, gameData} = usePixelawProvider();
    const settings = useSettingsStore();
    const updateService = useUpdateService(settings.config?.serverUrl!);
    const pixelStore = useDojoPixelStore(settings.config?.toriiUrl!);
    const tileStore = useSimpleTileStore(`${settings.config?.serverUrl}/tiles`);
    const { color, setColor, center, setCenter, zoom, setZoom, setHoveredCell, setClickedCell } = useViewStateStore();
    const appStore = useDojoAppStore();
    useSyncedViewStateStore();
    useDojoInteractHandler(pixelStore, gameData!);

    useEffect(() => {
        if (!updateService.tileChanged) return;
        tileStore.fetchTile(updateService.tileChanged!.tileName);
        pixelStore.refresh();
    }, [updateService.tileChanged]);

    const onWorldviewChange = (newWorldview: Bounds) => {
        updateService.setBounds(newWorldview);
        pixelStore.prepare(newWorldview);
        tileStore.prepare(newWorldview);
    };

    const onCellHover = (coordinate: Coordinate | undefined) => {
        setHoveredCell(coordinate);
    };

    const onCellClick = (coordinate: Coordinate) => {
        setClickedCell(coordinate);
    };

    const onColorSelect = (color: string) => {
        color = color.replace('#', '');
        setColor(color);
    };

    const zoombasedAdjustment = useMemo(() => {
        if (zoom > 3000) {
            return '1rem';
        }
        return '-100%';
    }, [zoom]);

    return (
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
            <div className={styles.colorpicker} style={{ bottom: zoombasedAdjustment }}>
                <SimpleColorPicker color={color} onColorSelect={onColorSelect} />
            </div>
            <div className={styles.apps} style={{ left: zoombasedAdjustment }}>
                <Apps
                    appStore={appStore}
                />
            </div>
            {/* ParamDialog and other components if needed */}
        </>
    );
};

export default ViewportPage;
