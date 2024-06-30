import React, {useState} from 'react';
import styles from './ParamDialog.module.css';
import {ParamDefinitionType} from "@/dojo/utils/Instruction.js";

interface ParamDialogProps {
    params: ParamDefinitionType[]; // Consider defining a more specific type
    onSubmit: (values: any) => void; // Add an onSubmit prop
    onClose: () => void;
}

const ParamDialog: React.FC<ParamDialogProps> = ({params, onSubmit, onClose}) => {
    const [values, setValues] = useState<any>({}); // Initialize state to hold parameter values

    const handleChange = (paramName: string, value: any) => {
        setValues(prev => ({...prev, [paramName]: value}));
    };

    const handleSubmit = () => {
        onSubmit(values);
        onClose(); // Close dialog after submission
    };
    console.log("p", params)

    return (
        <>
            <div className={styles.overlay}></div>
            <div className={styles.dialogContainer}>
                <h1 className={styles.header}>Params</h1>
                {params.map(param => {
                    switch (param.type) {
                        case 'enum':
                            return (
                                <div key={param.name} className={styles.paramRow}>
                                    <label className={styles.paramLabel}>{param.name}</label>
                                    <div className={styles.toggleButtonGroup}>
                                        {param.variants.map(variant => (
                                            <button
                                                key={variant.name}
                                                className={`${styles.toggleButton} ${values[param.name] === variant.value ? styles.activeToggleButton : ''}`}
                                                onClick={() => handleChange(param.name, variant.value)}
                                            >
                                                {variant.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        case 'number':
                        case 'string':
                        default:
                            return (
                                <div key={param.name} className={styles.paramRow}>
                                    <label className={styles.paramLabel}>{param.name}</label>
                                    <input
                                        className={styles.paramInput}
                                        type={param.type === 'number' ? 'number' : 'text'}
                                        value={values[param.name] || ''}
                                        onChange={(e) => handleChange(param.name, e.target.value)}
                                    />
                                </div>
                            );
                    }
                })}
                <div className={styles.buttonsContainer}>
                    <button className={`${styles.button} ${styles.submitButton}`} onClick={handleSubmit}>Submit</button>
                    <button className={`${styles.button} ${styles.closeButton}`} onClick={onClose}>Close</button>
                </div>
            </div>
        </>
    );
};

export default ParamDialog;
