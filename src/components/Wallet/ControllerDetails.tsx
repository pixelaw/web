import type ControllerConnector from "@cartridge/connector/controller"
import type React from "react"
import { useEffect, useState } from "react"
import styles from "./ControllerDetails.module.css"

interface ControllerDetailsProps {
    connector: ControllerConnector
}

const ControllerDetails: React.FC<ControllerDetailsProps> = ({ connector }) => {
    const [username, setUsername] = useState<string>("")

    useEffect(() => {
        if (!connector) return

        connector.username().then((username) => {
            setUsername(username)
        })

        console.log(connector.controller.account)
    }, [connector])

    const openProfile = async () => {
        if (!connector) return
        await connector.controller.openProfile()
    }
    const openSettings = async () => {
        if (!connector) return
        await connector.controller.openSettings()
    }
    const disconnect = async () => {
        if (!connector) return
        await connector.controller.disconnect()
    }
    const connect = async () => {
        if (!connector) return
        await connector.controller.connect()
    }

    return (
        <div>
            <p>Username: {connector ? username : "No controller"}</p>
            <p>
                <button type={"button"} onClick={openProfile}>
                    Open Profile
                </button>
                <button type={"button"} onClick={openSettings}>
                    Open Settings
                </button>
                <button type={"button"} onClick={connect}>
                    Connect
                </button>
                <button type={"button"} onClick={disconnect}>
                    Disconnect
                </button>
            </p>
        </div>
    )
}

export default ControllerDetails
