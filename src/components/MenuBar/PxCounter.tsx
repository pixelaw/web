import { usePixelawProvider } from "@/providers/PixelawProvider.tsx";
import styles from "@/components/MenuBar/MenuBar.module.css";
import React from "react";
import usePlayer from "@/hooks/usePlayer.ts";
import usePixelRecoveryRate from "@/hooks/usePixelRecoveryRate.ts";

const PxCounter = () => {
    const { gameData } = usePixelawProvider();

    const address = gameData?.account.account?.address ?? '';

    const player = usePlayer(address);
    const pixelRecoveryRate = usePixelRecoveryRate();

    const playerPx = player?.data?.current_px ?? 10;
    const maxPx = player?.data?.max_px ?? 10;
    const recoveryRate = pixelRecoveryRate?.data?.rate ?? 0;
    const playerLastDate = player?.data?.last_date ?? 0;

    const [currentPx, setCurrentPx] = React.useState(playerPx);
    const [lastDate, setLastDate] = React.useState(playerLastDate);
    const [pxChange, setPxChange] = React.useState(0); // 新しい状態を追加

    React.useEffect(() => {
        if (lastDate === playerLastDate) return;
        const currentSeconds = Math.floor(Date.now() / 1_000);
        const pxRecovered = Math.floor((currentSeconds - playerLastDate) / recoveryRate);
        const newPx = playerPx + pxRecovered > maxPx ? maxPx : playerPx + pxRecovered;
        setPxChange(newPx - currentPx); // 変化量を設定
        setCurrentPx(newPx);
        setLastDate(playerLastDate);
    }, [playerLastDate, playerPx, lastDate, recoveryRate, maxPx]);

    React.useEffect(() => {
        if (!recoveryRate || maxPx === currentPx) return;
        const interval = setInterval(() => {
            setCurrentPx(prevCurrentPx => {
                const newPx = prevCurrentPx === maxPx ? maxPx : prevCurrentPx + 1;
                setPxChange(1); // 1ずつ増えるので、変化量を1に設定
                return newPx;
            });
        }, recoveryRate * 1_000);

        return () => clearInterval(interval);
    }, [recoveryRate, currentPx, maxPx]);

    React.useEffect(() => {
        if (pxChange !== 0) {
            const timeout = setTimeout(() => setPxChange(0), 1000); // 1秒後に変化量をリセット
            return () => clearTimeout(timeout);
        }
    }, [pxChange]);

    return (
        <div className={styles.addressContainer}>
            {currentPx}/{maxPx} PX
            {pxChange !== 0 && (
                <div className={styles.pxChange}>
                    {pxChange > 0 ? `+${pxChange}` : pxChange}
                </div>
            )}
        </div>
    );
}

export default PxCounter;
