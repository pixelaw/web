import type { TPixelStore } from "@/webtools/types"
import { create } from "zustand"

export type TProviderPixelStore = {
  store: TPixelStore,
  setStore: (store: TPixelStore) => void
}


export const usePixelStore = create<TProviderPixelStore>()((set) => ({
  store: null!,
  setStore: (store) => set({ store }),
}))

export const PixelStore = () => {
  return {
      ...usePixelStore.getState(),
      set: usePixelStore.setState,
      ...usePixelStore.getState().store,
  }
}