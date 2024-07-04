import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MenuBar.module.css';
import { formatWalletAddress } from '@/global/utils.ts';
import PxCounter from '@/components/MenuBar/PxCounter.tsx';

interface MenuBarProps {
    address?: string;
    endTime: Date;
}

const MenuBar: React.FC<MenuBarProps> = ({ address, endTime }) => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = endTime.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft(
                    `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
                );
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
                <img src='/assets/logo/pixeLaw-logo.png' alt='logo' />
            </div>

            <div className={styles.countdownContainer}>{timeLeft}</div>

            <div className={styles.rightSection}>
                <div className={styles.addressContainer}>{formatWalletAddress(address || '')}</div>
                <PxCounter />
            </div>
        </div>
    );
};

export default MenuBar;
