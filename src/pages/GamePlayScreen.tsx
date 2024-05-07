import {cn} from "@/utils/";
import Main from "@/components/Main";
import React from "react";
import {useMainLayout} from "@/components/layouts/MainLayout";

export default function GamePlayScreen() {
    const {setHasNavbar} = useMainLayout()

    React.useEffect(() => {
        setHasNavbar(true)
    }, [])

    return (
        <React.Fragment>
            <div
                className={cn(
                    [
                        'bg-brand-body',
                        'w-full h-full',
                        "overflow-hidden"
                    ]
                )}
            >
                <Main/>
            </div>
        </React.Fragment>
    )
}
