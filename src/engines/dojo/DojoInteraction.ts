import type { EngineAction, Interaction } from "@/types.ts"

export class DojoInteraction implements Interaction {
    actions: EngineAction[]
    dialog: HTMLDialogElement
}
