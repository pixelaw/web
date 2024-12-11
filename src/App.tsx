import Loading from "@/components/Loading/Loading.tsx"
import MenuBar from "@/components/MenuBar/MenuBar.tsx"
import SettingsPage from "@/pages/SettingsPage.tsx"
import ViewportPage from "@/pages/ViewportPage.tsx"
import { usePixelawProvider } from "@/providers/PixelawProvider.tsx"
import { Route, Routes } from "react-router-dom"
import styles from "./App.module.css"
import {QueryBuilder, SDK, createDojoStore, init} from "@dojoengine/sdk";

import { SchemaType} from "@/generated/models.gen.ts";
import {useEffect} from "react";
import {addAddressPadding} from "starknet";

function App() {


    //<editor-fold desc="State">

    //</editor-fold>

    //<editor-fold desc="Hooks">
    // const useDojoStore = createDojoStore<SchemaType>();
    // const state = useDojoStore((state) => state);
    // const entities = useDojoStore((state) => state.entities);

    const { clientState, clientError, dojoStuff } = usePixelawProvider()

/*

    console.log({entities})
    useEffect(() => {
        if(!dojoStuff || !dojoStuff.sdk) return
        let unsubscribe: (() => void) | undefined;
        const appQuery = new QueryBuilder<SchemaType>()
            .namespace("pixelaw", (n) =>
                n.entity("App", e => e.neq("name", ""))
            )
            .build()

        const pixelQuery = new QueryBuilder<SchemaType>()
            .namespace("pixelaw", (n) =>
                n.entity("Pixel", e => {
                    e
                        .gte("x", 0)
                        .lte("x", 10)
                }
                )
            )
            .build()


        const q = async () => {
            dojoStuff.sdk.getEntities({query: pixelQuery, callback: r => {
                    console.log("q result", r)
                }})
        }
        const subscribe = async () => {
            console.log("ja")


            console.log(query)

            const subscription = await dojoStuff!.sdk.subscribeEntityQuery({
                query,
                callback: (response) => {
                    if (response.error) {
                        console.error(
                            "Error setting up entity sync:",
                            response.error
                        );
                    } else if (
                        response.data &&
                        response.data[0].entityId !== "0x0"
                    ) {
                        console.log("subscribed", response.data[0]);
                        state.updateEntity(response.data[0]);
                    }
                },
            });

            unsubscribe = () => subscription.cancel();
        };

        // subscribe();
q();
        console.log("a")
        return () => {
            if (unsubscribe) {
                unsubscribe();
                console.log("d")
            }
        };
    }, [dojoStuff?.sdk, dojoStuff?.userAccount?.address]);
*/


    //</editor-fold>

    //<editor-fold desc="Handlers">

    //</editor-fold>

    //<editor-fold desc="Custom behavior">

    //</editor-fold>

    //<editor-fold desc="Output">
    if (clientState === "loading") {
        document.title = "PixeLAW: Loading"
        return <Loading />
    }

    if (clientState === "error") {
        document.title = "PixeLAW: Error"
        const errorMessage = `${clientError}`
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorMessage}>
                    <h1 className={styles.errorTitle}>Something went wrong</h1>
                    {errorMessage !== "" && <p className={styles.errorDetail}>{errorMessage}</p>}
                    <p className={styles.errorSuggestion}>
                        Try to refresh this page. If issue still persists, alert the team at Discord.
                    </p>
                </div>
            </div>
        )
    }

    document.title = "PixeLAW: World"

    return (
        <div className={styles.container}>
            <MenuBar />

            <div className={styles.main}>
                <Routes>
                    <Route
                        path="/settings"
                        element={<SettingsPage />}
                    />
                    <Route
                        path="/"
                        element={<ViewportPage />}
                    />
                </Routes>
            </div>
        </div>
    )
    //</editor-fold>
}

export default App
