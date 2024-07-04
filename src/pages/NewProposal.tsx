import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import Select, { type GroupBase, type CSSObjectWithLabel, type OptionProps } from 'react-select';
import { usePixelawProvider } from '@/providers/PixelawProvider';
import { ProposalType } from '@/global/types';
import { GAME_ID } from '@/global/constants';
import { hexRGBtoNumber } from '@/global/utils.ts';

const NewProposal: React.FC = () => {
    const [proposalType, setProposalType] = useState('Add Color');
    const [color, setColor] = useState('#FFFFFF');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const handleColorChange = (color: string) => {
        setColor(color);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
            setShowColorPicker(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const { gameData } = usePixelawProvider();

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
                    hexRGBtoNumber(color.replace('#', '')),
                )
                .then(() => navigate('/governance'));
        }
    };

    const colors = ['#000000', '#FF00FF', '#00FFFF'];

    const colorOptionsFormatted = colors.map((color) => ({
        value: color,
        label: (
            <div className='flex items-center'>
                <div className='mr-2 size-6 rounded-md' style={{ backgroundColor: color }} />
                {color}
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
                },
                false,
                GroupBase<{
                    value: string;
                }>
            >,
        ) => ({
            ...base,
            backgroundColor: prop.isFocused ? '#2D3748' : '#bg0grat', // bg-gray-800 : bg-gray-700
            color: '#fff', // text-white
        }),
    };

    return (
        <div className='flex min-h-screen w-full flex-col bg-gray-900 text-white'>
            <div className='flex grow items-center justify-center p-4'>
                <div className='w-full max-w-xl rounded-lg bg-gray-800 p-6 shadow-lg'>
                    <h2 className='mb-6 text-3xl font-bold'>New Proposal</h2>

                    <div className='mb-4'>
                        <label className='mb-2 block text-lg'>Select Proposal Type</label>
                        <select
                            value={proposalType}
                            onChange={(e) => setProposalType(e.target.value)}
                            className='w-full rounded-md bg-gray-700 p-3 text-white'
                        >
                            <option value='Add Color'>Add Color</option>
                            <option value='Make A Disaster'>Make A Disaster</option>
                        </select>
                    </div>

                    {proposalType === 'Add Color' && (
                        <div className='mb-4'>
                            <label className='mb-2 block text-lg'>Color (i.e. #00FFAA)</label>
                            <div className='relative flex items-center'>
                                <div
                                    className='mr-4 h-10 w-11 cursor-pointer rounded-md'
                                    style={{ backgroundColor: color }}
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                />
                                <input
                                    type='text'
                                    value={color.toUpperCase()}
                                    onChange={(e) => setColor(e.target.value.toUpperCase())}
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
                                            onChange={(color) => handleColorChange(color.hex)}
                                            disableAlpha
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {proposalType === 'Make A Disaster' && (
                        <div className='mb-4'>
                            <label className='mb-2 block text-lg'>
                                Choose a color to turn white on the canvas.
                            </label>
                            <Select
                                value={colorOptionsFormatted.find(
                                    (option) => option.value === color,
                                )}
                                onChange={(color: { value: string } | null) =>
                                    handleColorChange(color?.value ?? '')
                                }
                                options={colorOptionsFormatted}
                                styles={customStyles}
                                className='w-full rounded-md bg-gray-700 text-white'
                            />
                        </div>
                    )}

                    <div className='mt-6 flex justify-between'>
                        <Link
                            to='/governance'
                            className='rounded-md bg-gray-600 px-4 py-2 text-white transition duration-300 hover:bg-gray-500'
                        >
                            Back
                        </Link>
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
    );
};

export default NewProposal;
