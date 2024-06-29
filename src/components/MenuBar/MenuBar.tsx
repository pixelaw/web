import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './MenuBar.module.css';
import { formatWalletAddress } from "@/global/utils.ts";

interface MenuBarProps {
    address: string;
};

const MenuBar: React.FC<MenuBarProps> = ({ address }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const showSettings = location.pathname === '/settings';
    const showGovernance = location.pathname !== '/governance';

    const toggleSettings = () => {
        if (showSettings) {
            navigate(-1);
        } else {
            navigate('/settings');
        }
    };

    return (
        <div className={styles.inner}>
            <div className={styles.logoContainer} onClick={() => navigate('/')}>
                <img src="/assets/logo/pixeLaw-logo.png" alt="logo"/>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.addressContainer}>
                    {formatWalletAddress(address.address || '')}
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