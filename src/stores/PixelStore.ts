import type { PixelStore as IPixelStore } from "@/webtools/types"
import { create } from "zustand"

export type TProviderPixelStore = {
  store: IPixelStore,
  setStore: (store: IPixelStore) => void
}


export const usePixelStore = create<TProviderPixelStore>()((set) => ({
  store: null!,
  setStore: (store) => set({ store }),
}))

// @dev deconstructing the store for easier access, setStore always replaces the store (and thus all other functions) giving you -> PixelStore().getPixel(x,y)
export const PixelStore = () => {
  return {
      ...usePixelStore.getState().store,
      setStore: usePixelStore.getState().setStore,
  }
}