import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {NotificationDataType, PositionWithAddressAndType} from "./types";
import { createCamera } from "@/drawing/camera";

export interface IUserStore {
    gameMode: string;
    camera: ReturnType<typeof createCamera> | null;
    hoveredPixel: PositionWithAddressAndType;
    selectedHexColor: string;
    notificationData: NotificationDataType | undefined;
    setGameMode(data: string): void;
    set(data: Partial<IUserStore>): void;
}

const useGameStore = create<IUserStore>()(
    immer((set) => ({
        gameMode: "paint",
        camera: null,
        hoveredPixel: {
            x: 0,
            y: 0,
            address: '',
            pixel: '',
        },
        selectedHexColor: '#FFFFFF',
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
 * @dev Example usage
 */

// getGameStore().set({gameMode: "paint"})
// getGameStore().gameMode;
