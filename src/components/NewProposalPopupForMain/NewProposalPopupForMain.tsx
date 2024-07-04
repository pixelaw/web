import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import Select, {
    type GroupBase,
    type OptionProps,
    type CSSObjectWithLabel,
    type SingleValue,
} from 'react-select';
import { ProposalType } from '@/global/types';
import { GAME_ID } from '@/global/constants';
import { usePixelawProvider } from '@/providers/PixelawProvider';
import { hexRGBtoNumber, numRGBAToHex, toastContractError } from '@/global/utils.ts';
import useAllowedColors from '@/hooks/useAllowedColors.ts';

const NewProposalPopupForMain: React.FC = () => {
    const [proposalType, setProposalType] = useState('Add Color');
    const [color, setColor] = useState('#FFFFFF00');

    const [isCreatingNewProposal, setIsCreatingNewProposal] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);

    const { gameData } = usePixelawProvider();

    const handleColorChange = (color: string) => {
        setColor(color);
    };

    const handleDisasterColorChange = (
        selectedOption: SingleValue<{ value: string; label: JSX.Element }>,
    ) => {
        if (selectedOption) {
            console.log(selectedOption.value);
            setColor(formatColorToRGBA(selectedOption.value)); // to submit the color.
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
            setShowColorPicker(false);
        }
    };

    const handleClickOutsidePopup = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setIsCreatingNewProposal(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('mousedown', handleClickOutsidePopup);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousedown', handleClickOutsidePopup);
        };
    }, []);

    const handleSubmit = () => {
        const type =
            proposalType === 'Add Color'
                ? ProposalType.AddNewColor
                : ProposalType.ResetToWhiteByColor;
        if (gameData && gameData.account.account) {
            gameData.setup.systemCalls
                .createProposal(
                    gameData.account.account,
                    GAME_ID,
                    type,
                    hexRGBtoNumber(formatColorToRGB(color).replace('#', '')),
                )
                .then(() => {
                    setIsCreatingNewProposal(false);
                })
                .catch((e) => toastContractError(e));
        }
    };

    function formatColorToRGBA(color: string) {
        if (color.length === 7 && color.startsWith('#')) {
            return color + '00';
        } else if (color.length === 9 && color.startsWith('#')) {
            return color;
        } else {
            return color;
        }
    }

    function formatColorToRGB(color: string) {
        if (color.length === 7 && color.startsWith('#')) {
            return color;
        } else if (color.length === 9 && color.startsWith('#')) {
            return color.slice(0, -2);
        } else {
            return color;
        }
    }

    const allowed_colors = useAllowedColors(GAME_ID);
    const allowed_colors_arrays = allowed_colors?.data ?? [];
    const colorArrays = allowed_colors_arrays.map((colorData) =>
        numRGBAToHex(colorData.color).toUpperCase(),
    );

    const colorOptionsFormatted = colorArrays.map((color) => ({
        value: color,
        label: (
            <div className='flex items-center'>
                <div
                    className='mr-2 size-6 rounded-md'
                    style={{ backgroundColor: formatColorToRGB(color) }}
                />
                {formatColorToRGB(color).toUpperCase()}
            </div>
        ),
    }));

    const customStyles = {
        control: (base: CSSObjectWithLabel) => ({
            ...base,
            backgroundColor: 'bg-gray-800',
            color: '#fff', // text-white
            borderColor: '#4A5568', // border-color
            boxShadow: 'none', // Remove default box shadow
            '&:hover': {
                borderColor: '#4A5568', // border-color on hover
            },
        }),
        singleValue: (base: CSSObjectWithLabel) => ({
            ...base,
            color: '#fff', // text-white
        }),
        menu: (base: CSSObjectWithLabel) => ({
            ...base,
            backgroundColor: '#4A5568', // bg-gray-700
        }),
        option: (
            base: CSSObjectWithLabel,
            prop: OptionProps<
                {
                    value: string;
                    label: JSX.Element;
                },
                false,
                GroupBase<{
                    value: string;
                    label: JSX.Element;
                }>
            >,
        ) => ({
            ...base,
            backgroundColor: prop.isFocused ? '#2D3748' : '#bg0grat', // bg-gray-800 : bg-gray-700
            color: '#fff', // text-white
        }),
    };

    return (
        <div>
            {!isCreatingNewProposal && (
                <button
                    onClick={() => setIsCreatingNewProposal(true)}
                    className='w-full rounded-md bg-blue-600 px-10 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-500'
                >
                    Create A New Proposal
                </button>
            )}

            {isCreatingNewProposal && (
                <div className='fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur'>
                    <div ref={popupRef} className='w-1/3'>
                        <div className='w-full max-w-xl rounded-lg bg-gray-800 p-12 text-white shadow-lg'>
                            <h2 className='mb-6 text-3xl font-bold'>New Proposal</h2>
                            <div className='mb-4'>
                                <label className='mb-2 block text-lg'>Select Proposal Type</label>
                                <select
                                    value={proposalType}
                                    onChange={(e) => setProposalType(e.target.value)}
                                    className='w-full rounded-md bg-gray-700 p-3 text-white'
                                >
                                    <option value='Add Color'>Add Color</option>
                                    <option value='Reset To White'>Reset To White</option>
                                </select>
                            </div>

                            {proposalType === 'Add Color' && (
                                <div className='mb-4'>
                                    <label className='mb-2 block text-lg'>
                                        Color (i.e. #00FFAA)
                                    </label>
                                    <div className='relative flex items-center'>
                                        <div
                                            className='mr-4 h-10 w-11 cursor-pointer rounded-md'
                                            style={{ backgroundColor: formatColorToRGB(color) }}
                                            onClick={() => setShowColorPicker(!showColorPicker)}
                                        />
                                        <input
                                            type='text'
                                            value={formatColorToRGB(color)}
                                            onChange={(e) => {
                                                setColor(
                                                    formatColorToRGBA(e.target.value.toUpperCase()),
                                                );
                                            }} // add 00
                                            className='w-full rounded-md bg-gray-700 p-2 text-white'
                                        />
                                        {showColorPicker && (
                                            <div
                                                className='absolute z-10'
                                                style={{ left: '-250px' }}
                                                ref={colorPickerRef}
                                            >
                                                <SketchPicker
                                                    color={color}
                                                    onChange={(color) =>
                                                        handleColorChange(color.hex)
                                                    }
                                                    disableAlpha
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {proposalType === 'Reset To White' && (
                                <div className='mb-4'>
                                    <label className='mb-2 block text-lg'>
                                        Choose a color to turn white on the canvas.
                                    </label>
                                    <Select
                                        value={colorOptionsFormatted.find(
                                            (option) => formatColorToRGB(option.value) === color,
                                        )}
                                        onChange={handleDisasterColorChange}
                                        options={colorOptionsFormatted}
                                        styles={customStyles}
                                        className='w-full rounded-md bg-gray-700 text-white'
                                    />
                                </div>
                            )}

                            <div className='mt-6 flex justify-between'>
                                <button
                                    onClick={() => setIsCreatingNewProposal(false)}
                                    className='rounded-md bg-gray-600 px-4 py-2 text-white transition duration-300 hover:bg-gray-500'
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className='rounded-md bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-500'
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewProposalPopupForMain;
