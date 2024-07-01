import styles from './SimpleColorPicker.module.css';
import {useEntityQuery} from "@dojoengine/react";
import {usePixelawProvider} from "@/providers/PixelawProvider.tsx";
import {Has, HasValue, Entity} from "@dojoengine/recs";
import PaletteColor from "@/components/ColorPicker/PaletteColor.tsx";
import SimpleColorPickerItem from "@/components/ColorPicker/SimpleColorPickerItem.tsx";
import {GAME_ID, PALETTE_COLORS_LENGTH} from "@/global/constants.ts";
import {getEntityIdFromKeys} from "@dojoengine/utils";

const colors = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#9400D3",
    "#FFFFFF", // white
    "#000000"  // black
];

export interface ColorPickerProps {
    onColorSelect: (color: string) => void;
    color: string;
}

const sortIndices = () => {
    const sortedIndices: Entity[] = []
    for (let i = 0; i < PALETTE_COLORS_LENGTH; i++) {
        sortedIndices.push(
            getEntityIdFromKeys([
                BigInt(GAME_ID),
                BigInt(i)
            ])
        )
    }
    return sortedIndices
}

const sortedIndices = sortIndices()

const SimpleColorPicker: React.FC<ColorPickerProps> = ({onColorSelect, color: selectedColor}) => {
    selectedColor = `#${selectedColor}`

    const {gameData} = usePixelawProvider();

    const paletteColors = useEntityQuery(
        [
            Has(gameData!.setup.clientComponents.PaletteColors),
            HasValue(gameData!.setup.clientComponents.PaletteColors, {game_id: GAME_ID}),
        ], { updateOnValueChange: true }
    )

    const orderedPaletteColors = sortedIndices.filter(sortedIndex => {
        const bigIntSortedIndex = BigInt(sortedIndex)
        return paletteColors.findIndex(paletteColor => BigInt(paletteColor) === bigIntSortedIndex) > -1
    })

    if (paletteColors.length) {
        return (
            <div className={styles.inner}>
                {orderedPaletteColors.map(paletteColor => (
                    <PaletteColor
                        key={paletteColor.toString()}
                        entityId={paletteColor}
                        onSelect={onColorSelect}
                        selectedColor={selectedColor}
                        lastIndex={paletteColors.length - 1}
                    />
                ))}
            </div>
        )
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
