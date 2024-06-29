import React from 'react';
import styles from './ParamDialog.module.css';

interface ParamDialogProps {
    params: any; // Adjust the type according to your data structure
    onClose: () => void;
}

const ParamDialog: React.FC<ParamDialogProps> = ({ params, onClose }) => {
    return (
        <div className={styles.inner}>
            <h1>Params</h1>
            {/* Render your params here */}
            <button onClick={onClose}>Close</button>
        </div>
    );
};
