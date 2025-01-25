import type { DojoStuff } from "@/core/dojo/DojoEngineInit.ts"
import type { App, AppStore } from "@/webtools/types/types.ts"

export class DojoAppStore implements AppStore {
    private dojoStuff

    constructor(dojoStuff: DojoStuff) {
        this.dojoStuff = dojoStuff
    }
    getAll(): App[] {
        return this.dojoStuff!.apps
    }

    getByName(name: string): App | undefined {
        return this.dojoStuff!.apps.find((app) => app.name === name)
    }
}
