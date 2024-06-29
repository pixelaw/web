import styles from './App.module.css';
import React, {useEffect, useMemo, useState, useRef} from "react";
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
import Settings from "@/pages/Settings/Settings.tsx";
import {usePixelawProvider} from "@/providers/PixelawProvider.tsx";
import {useViewStateStore, useSyncedViewStateStore} from "@/stores/ViewStateStore.ts";
import {useDojoInteractHandler} from "@/hooks/useDojoInteractHandler.ts";
import {useSettingsStore} from "@/stores/SettingsStore.ts";
import Governance from "@/pages/Governance.js";
import NewProposal from "@/pages/NewProposal.js";
import ProposalDetails from "@/pages/ProposalDetails.js";
import { RiArrowGoBackFill } from "react-icons/ri";
import NewProposalPopupForMain from '@/components/NewProposalPopupForMain/NewProposalPopupForMain.tsx';
import { FaArrowDown, FaArrowUp, FaFilter } from 'react-icons/fa';
import ProposalListForMain from './components/NewProposalPopupForMain/ProposalListForMain';
import FilterMenu from './components/FilterMenu/FilterMenu';
import {Has} from "@dojoengine/recs";
import {useEntityQuery, useComponentValue} from "@dojoengine/react";


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
        setClickedCell,
        selectedApp, // added
        setSelectedApp, // added
    } = useViewStateStore();

    // FIXME: should be in the ViewStateStore??
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isProposalListVisible, setIsProposalListVisible] = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Closed'>('All');
    const filterRef = useRef<HTMLDivElement>(null);
    // const colorPickerRef = useRef<HTMLDivElement>(null);

    useDojoInteractHandler(pixelStore, gameData!);
    useSyncedViewStateStore();
    //</editor-fold>
    // console.log(gameData?.setup.contractComponents.Game);

    // const proposal = useComponentValue(gameData!.setup.contractComponents.Proposal, entityId)


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

    function toggleColorPicker() {
        setIsColorPickerVisible(prevState => !prevState);
    }

    function toggleProposalList() {
        setIsProposalListVisible(prevState => !prevState);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
            setFilterOpen(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
      
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

    
    // get end date (FIXME: It's not smooth...)
    const endTimestamp = gameData?.setup.contractComponents.Game.values.end.entries().next().value[1];
    const endDate = new Date(endTimestamp * 1000);
    
    return (
        // <div className={styles.container}>
        <div className='bg-bg-primary min-h-screen flex flex-col'>
            <MenuBar address={gameData?.account?.account || ''} endTime={endDate}/> {/* have to get from game status*/}
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
                            {/* <div className={styles.colorpicker} style={{bottom: zoombasedAdjustment}}> */}
                            <div className={styles.colorpicker} style={{ bottom: zoombasedAdjustment, display: isColorPickerVisible ? 'flex' : 'none' }}>
                                <SimpleColorPicker color={color} onColorSelect={onColorSelect}/>
                                <button className={styles.closeButton} onClick={toggleColorPicker}>
                                    <RiArrowGoBackFill size={22}/>
                                </button>
                            </div>

                            <div className={styles.proposalListContainer}>
                                <div className={`flex items-center justify-between mb-4`}>
                                    <div className='text-white text-xl font-bold'>
                                        Proposals
                                    </div>
                                    <div className='ml-1 relative flex items-center'>
                                        {isProposalListVisible && (
                                            <button 
                                            className='bg-gray-700 text-white px-4 py-2 rounded-md'
                                            onClick={() => setFilterOpen(!filterOpen)}
                                            >
                                                <FaFilter />
                                            </button>)}
                                        {isProposalListVisible && filterOpen && (
                                            <div 
                                            className='absolute mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10' 
                                            ref={filterRef}
                                            style={{ top: '100%', right: -100 }}
                                            >
                                                <FilterMenu statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
                                            </div>
                                        )}
                                    </div>
                                    <button className={`ml-auto text-white ${isProposalListVisible ? 'rotate-180' : ''} transition duration-300`} onClick={toggleProposalList}>
                                        <FaArrowDown />
                                    </button>
                                </div>
                                {isProposalListVisible && (
                                    <div className='mb-4'>
                                        <div className=''>
                                            <ProposalListForMain headerHeight={64} statusFilter={statusFilter}/>
                                        </div>
                                        <div className='pt-4'>
                                            <NewProposalPopupForMain />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.buttonContainer}>
                                <button className={styles.placePixelButton} onClick={() => {toggleColorPicker(); setSelectedApp('p_war');}} style={{ display: isColorPickerVisible ? 'none' : 'flex' }}>
                                    Place a Pixel
                                </button>
                            </div>



                            {/* <div className={styles.apps} style={{left: zoombasedAdjustment}}>
                                <Apps
                                    appStore={appStore}
                                />
                            </div> */}
                        </>
                    }/>
                    <Route path="/governance" element={<Governance />} />
                    <Route path="/new-proposal" element={<NewProposal />} />
                    <Route path="/proposal/:id" element={<ProposalDetails />} />

                </Routes>
            </div>
        </div>
    )
    //</editor-fold>
}


export default App
