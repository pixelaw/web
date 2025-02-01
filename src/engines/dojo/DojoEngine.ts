import { RestTileStore } from "@/common/RestTileStore.ts"
import { WsUpdateService } from "@/common/WsUpdateService.ts"
import { type DojoStuff, dojoInit } from "@/engines/dojo/DojoEngine.init.ts"
import { DojoInteraction } from "@/engines/dojo/DojoInteraction.ts"
import DojoSqlPixelStore from "@/engines/dojo/DojoSqlPixelStore.ts"
import { schema } from "@/engines/dojo/generated/models.gen.ts"
import getParamsDef from "@/engines/dojo/utils/utils/paramsDef.ts"
import type { App, DojoConfig, Engine, EngineStatus, Interaction, Pixel, Position } from "@/types.ts"
import type { PixelStore } from "@/types.ts"
import type { AppStore, TileStore, UpdateService } from "@/types.ts"
import type { Connector } from "@starknet-react/core"
import { DojoAppStore } from "./DojoAppStore.ts"

export class DojoEngine implements Engine {
    pixelStore: PixelStore = null!
    tileStore: TileStore = null!
    appStore: AppStore = null!
    updateService: UpdateService = null!
    status: EngineStatus = "uninitialized"
    config: DojoConfig = null!
    dojoSetup: DojoStuff | null = null

    async init(config: DojoConfig) {
        this.config = config
        try {
            // Setup Dojo
            this.dojoSetup = await dojoInit(this.config, schema)
            this.status = this.dojoSetup ? "ready" : "error"

            // Setup AppStore
            this.appStore = new DojoAppStore(this.dojoSetup)

            // Setup PixelStore
            this.pixelStore = new DojoSqlPixelStore(this.dojoSetup!.sdk!)

            // Setup UpdateService
            this.updateService = new WsUpdateService(config.serverUrl)

            // Setup TileStore
            this.tileStore = new RestTileStore(config.serverUrl)
        } catch (error) {
            console.error("Dojo init error:", error)
        }
    }

    getInteraction(app: App, pixel: Pixel): DojoInteraction {
        const result = new DojoInteraction()
        // TODO app has plugin
        // TODO determine function
        // TODO determine arguments

        // TODO populate actions
        // pixel
        // app
        // engine.manifest
        // engine.account?

        console.log("app", app)
        const action = pixel && pixel.action !== "0" ? pixel.action : "interact"

        const contractName = `${app.name}_actions`
        const position: Position = { ...pixel }

        console.log(action, position)

        const params = getParamsDef(this.dojoSetup.manifest, contractName, action, position, false)
        console.log("params", params)

        // TODO build dialog
        result.dialog = createDialog("")
        // if (params.length && !paramData) {
        //     onParamsRequired(params) // Use the callback to pass parameters where needed
        //     console.log("req")
        //     return // Stop further execution until params are handled
        // }

        // result.actions.return
        return result
    }
}

function createDialog(question: string): HTMLDialogElement {
    const dialog = document.createElement("dialog")
    dialog.className = "dialog"

    const form = document.createElement("form")
    form.method = "dialog"
    form.className = "form"

    const label = document.createElement("label")
    label.textContent = "hahahahaha sd f sdfsdfsdfs f sd  sdfs"
    label.className = "label"

    const input = document.createElement("input")
    input.type = "checkbox"
    input.name = "booleanInput"
    input.className = "checkbox"

    const okButton = document.createElement("button")
    okButton.type = "submit"
    okButton.textContent = "OK"
    okButton.className = "button ok-button"

    const cancelButton = document.createElement("button")
    cancelButton.type = "button"
    cancelButton.textContent = "Cancel"
    cancelButton.className = "button cancel-button"
    cancelButton.onclick = () => dialog.close()

    form.appendChild(label)
    form.appendChild(input)
    form.appendChild(document.createElement("br"))
    form.appendChild(okButton)
    form.appendChild(cancelButton)

    dialog.appendChild(form)

    return dialog
}
