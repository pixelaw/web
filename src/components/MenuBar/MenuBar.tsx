import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './MenuBar.module.css';
import { formatWalletAddress } from "@/global/utils.ts";

interface MenuBarProps {
    address: string;
    endTime: Date;
    currentPx: number;
    maxPx: number;
};

const MenuBar: React.FC<MenuBarProps> = ({ address, endTime, currentPx, maxPx}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [timeLeft, setTimeLeft] = useState('');

    const showSettings = location.pathname === '/settings';
    const showGovernance = location.pathname !== '/governance';

    const toggleSettings = () => {
        if (showSettings) {
            navigate(-1);
        } else {
            navigate('/settings');
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = endTime.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft(`${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            } else {
                setTimeLeft('00:00:00:00');
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return (
        <div className={styles.inner}>
            <div className={styles.logoContainer} onClick={() => navigate('/')}>
                <img src="/assets/logo/pixeLaw-logo.png" alt="logo"/>
            </div>

            <div className={styles.countdownContainer}>
                {timeLeft}
            </div>

            <div className={styles.rightSection}>
                <div className={styles.addressContainer}>
                    {formatWalletAddress(address.address || '')}
                </div>
                <div className={styles.addressContainer}>
                    {currentPx}/{maxPx} PX
                </div>
                <div className={styles.buttonContainer}>
                    {!showGovernance && <button className={styles.menuButton} onClick={() => navigate('/')}>Draw</button>}
                    <button className={styles.menuButton} onClick={toggleSettings}>Settings</button>
                </div>
            </div>
        </div>
    );
};

export default MenuBar;