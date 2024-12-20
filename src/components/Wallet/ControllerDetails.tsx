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
    }, [connector])

    const openProfile = async () => {
        if (!connector) return
        await connector.controller.openProfile()
    }

    // openSettings
    return (
        <div>
            <p>Username: {connector ? username : "No controller"}</p>
            <p>
                Profile:{" "}
                <button type={"button"} onClick={openProfile}>
                    Open Profile
                </button>
            </p>
        </div>
    )
}

export default ControllerDetails
