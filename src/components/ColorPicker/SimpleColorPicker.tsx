import styles from './SimpleColorPicker.module.css';
import SimpleColorPickerItem from '@/components/ColorPicker/SimpleColorPickerItem.tsx';
import usePaletteColors from '@/hooks/usePaletteColors.ts';
import React from 'react';

const colors = [
    '#FF0000',
    '#FF7F00',
    '#FFFF00',
    '#00FF00',
    '#0000FF',
    '#4B0082',
    '#9400D3',
    '#FFFFFF', // white
    '#000000', // black
];

export interface ColorPickerProps {
    onColorSelect: (color: string) => void;
    color: string;
}

const SimpleColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, color: selectedColor }) => {
    selectedColor = `#${selectedColor}`;

    const paletteColors = usePaletteColors();

    if (paletteColors.data?.length) {
        const reversedData = (paletteColors?.data ?? []).slice().reverse();
        return (
            <div className={styles.inner}>
                {reversedData.map(({ color }, idx) => (
                    <SimpleColorPickerItem
                        key={color}
                        color={color}
                        onSelect={onColorSelect}
                        selectedColor={selectedColor}
                        old={idx === reversedData.length - 1}
                        latest={idx === 0}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className={styles.inner}>
            {colors.map((color, index) => (
                <SimpleColorPickerItem
                    key={color}
                    color={color}
                    onSelect={onColorSelect}
                    selectedColor={selectedColor}
                    old={index === 0}
                    latest={index === colors.length - 1}
                />
            ))}
        </div>
    );
};

export default SimpleColorPicker;
