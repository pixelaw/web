import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './MenuBar.module.css';
import {usePixelawProvider} from "@/providers/PixelawProvider.js";
import {formatWalletAddress} from "@/global/utils.js";

const MenuBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { gameData} = usePixelawProvider();


    if(!gameData) return
    const walletAddress = gameData.account.account?.address

    // Determine if the settings page is shown based on the current path
    const showSettings = location.pathname === '/settings';

    const toggleSettings = () => {
        if (showSettings) {
            navigate(-1); // Go back if we're currently showing settings
        } else {
            navigate('/settings'); // Navigate to settings if not currently showing
        }
    };
    return (
        <div className={styles.inner}>
            <div className={styles.logoContainer}>
                <img src="/assets/logo/pixeLaw-logo.png" alt="logo"/>

            </div>
            <div className={styles.rightSection}>
            <div className={styles.addressContainer}>
                {formatWalletAddress(walletAddress)}
            </div>
                <button className={styles.menuButton} onClick={toggleSettings}>Settings</button></div>
        </div>
    );
};

export default MenuBar;
