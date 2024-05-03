import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {NotificationDataType, PositionWithAddressAndType} from "./types";

export interface IUserStore {
  gameMode: string;
  positionWithAddressAndType: PositionWithAddressAndType;
  selectedHexColor: string;
  zoomLevel: number;
  notificationData: NotificationDataType | undefined;
  setGameMode(data: string): void;
  set(data: Partial<IUserStore>): void;
}


const useGameStore = create<IUserStore>()(
  immer((set) => ({
    gameMode: "paint",
    positionWithAddressAndType: {
      x: 0,
      y: 0,
      address: '',
      pixel: '',
    },
    selectedHexColor: '#FFFFFF',
    zoomLevel: 50,
    notificationData: undefined,  
    setGameMode: (data: string) => {
      set(state => state.gameMode = data);
    },
    set: (data: Partial<IUserStore>) => {
      set(state => {
        Object.assign(state, data);
      })
    },
  }))
);

const {getState : getGameStore} = useGameStore;
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