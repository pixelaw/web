import { usePixelawProvider } from '@/providers/PixelawProvider.tsx';
import { useComponentValue } from '@dojoengine/react';
import { numRGBAToHex } from '@/webtools/utils.ts';
import { type Entity } from '@dojoengine/recs';
import SimpleColorPickerItem from '@/components/ColorPicker/SimpleColorPickerItem.tsx';
import React from 'react';

type PropsType = {
    entityId: Entity;
    onSelect?: (color: string) => void;
    selectedColor?: string;
    lastIndex?: number;
};

const PaletteColor: React.FC<PropsType> = ({ entityId, onSelect, selectedColor, lastIndex }) => {
    const { gameData } = usePixelawProvider();
    const paletteColor = useComponentValue(
        gameData!.setup.clientComponents.PaletteColors,
        entityId,
    );

    if (!paletteColor) return <></>;

    const color = numRGBAToHex(paletteColor.color);

    return (
        <SimpleColorPickerItem
            color={color}
            onSelect={onSelect}
            selectedColor={selectedColor}
            old={paletteColor.idx === 0}
            latest={paletteColor.idx === lastIndex}
        />
    );
};

export default PaletteColor;
