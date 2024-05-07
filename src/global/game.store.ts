import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {NotificationDataType, PositionWithAddressAndType} from "./types";
import { createRef, MutableRefObject, RefObject } from "react";
import { Vector2 } from "threejs-math";

export interface IUserStore {
    gameMode: string;
    hoveredPixel: PositionWithAddressAndType;
    selectedHexColor: string;
    zoomLevel: Vector2;
    cameraOffset: Vector2;
    notificationData: NotificationDataType | undefined;
    setGameMode(data: string): void;
    set(data: Partial<IUserStore>): void;
}

let zoomLevel = createRef<number>() as MutableRefObject<number>;
zoomLevel.current = 50;

const useGameStore = create<IUserStore>()(
    immer((set) => ({
        gameMode: "paint",
        hoveredPixel: {
            x: 0,
            y: 0,
            address: '',
            pixel: '',
        },
        selectedHexColor: '#FFFFFF',
        zoomLevel: new Vector2(50,0),
        cameraOffset: new Vector2(0,0),
        notificationData: undefined,
        setGameMode: (data: string) => {
            set(state => {
                state.gameMode = data;
                return;
            });
        },
        set: (data: Partial<IUserStore>) => {
            set(state => {
                Object.assign(state, data);
                return;
            })
        },
    }))
);

const {getState: getGameStore} = useGameStore;
export {getGameStore, useGameStore};

/**
 * Example usage
 */

// getGameStore().set({gameMode: "paint"})
// getGameStore().gameMode;

// const gameMode = useGameStore(state => state.gameMode);

// const { gameMode, zoomLevel } = useGameStore(state => ({
//   gameMode: state.gameMode,
//   zoomLevel: state.zoomLevel,
// }));