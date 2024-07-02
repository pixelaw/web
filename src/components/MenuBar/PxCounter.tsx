import {usePixelawProvider} from "@/providers/PixelawProvider.tsx";
import styles from "@/components/MenuBar/MenuBar.module.css";
import React from "react";
import usePlayer from "@/hooks/usePlayer.ts";
import usePixelRecoveryRate from "@/hooks/usePixelRecoveryRate.ts";

const PxCounter = () => {
    const { gameData} = usePixelawProvider();

    const address = gameData?.account.account?.address ?? ''

    const player = usePlayer(address)
    const pixelRecoveryRate = usePixelRecoveryRate()

    const playerPx = player?.data?.current_px ?? 10
    const maxPx = player?.data?.max_px ?? 10
    const recoveryRate = pixelRecoveryRate?.data?.rate ?? 0
    const playerLastDate = player?.data?.last_date ?? 0

    const [currentPx, setCurrentPx] = React.useState(playerPx)
    const [lastDate, setLastDate] = React.useState(playerLastDate)

    React.useEffect(() => {
        if (lastDate === playerLastDate) return
        const currentSeconds = Math.floor(Date.now() / 1_000)
        const pxRecovered = Math.floor((currentSeconds - playerLastDate )/ recoveryRate)
        setCurrentPx(playerPx + pxRecovered > maxPx ? maxPx : playerPx + pxRecovered)
        setLastDate(playerLastDate)
    }, [playerLastDate, playerPx, lastDate, recoveryRate, maxPx])

    React.useEffect(() => {
        if (!recoveryRate || maxPx === currentPx) return
        const interval = setInterval(() => {
            setCurrentPx(prevCurrentPx => prevCurrentPx === maxPx ? maxPx : prevCurrentPx + 1)
        }, recoveryRate * 1_000)

        // Cleanup function to clear the interval when the component unmounts or when dependencies change
        return () => clearInterval(interval);

    }, [recoveryRate, currentPx, maxPx])



    return (
        <div className={styles.addressContainer}>
            {currentPx}/{maxPx} PX
        </div>
    )
}

export default PxCounter