import styles from "@/components/ColorPicker/SimpleColorPicker.module.css";

type PropsType = {
    color: string
    onSelect?: (color: string) => void,
    selectedColor?: string,
    old?: boolean,
    latest?: boolean
}

const SimpleColorPickerItem: React.FC<PropsType> =
    ({ color, onSelect, selectedColor, old, latest }) => {

    const handleClick = onSelect ? () => onSelect(color) : undefined

    const hasLabel = !!(old || latest);
    const selected = selectedColor === color

    return (
        <button
            style={{backgroundColor: color}}
            className={`${styles.button} ${color === '#FFFFFF' ? styles['button-white'] : ''} ${selected ? styles.selected : ''}`}
            aria-label={`Color ${color}`}
            onClick={handleClick}
        >
            {hasLabel && (
                <span className={styles.label}>
                  {latest ? 'new' : ''}
                  {old && !latest ? 'old' : ''}
                </span>
            )}
        </button>
    )
}

export default SimpleColorPickerItem