import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import Select from 'react-select';
import {ProposalType} from "@/global/types";
import {GAME_ID} from "@/global/constants";
import {usePixelawProvider} from "@/providers/PixelawProvider";
import {hexRGBtoNumber, numRGBAToHex, toastContractError, toastProposalAdded} from "@/global/utils.ts";
import useAllowedColors from '@/hooks/useAllowedColors.ts';

const NewProposalPopupForMain: React.FC = () => {
  const [proposalType, setProposalType] = useState('Add Color');
  const [color, setColor] = useState('#FFFFFF00');
//   const [colorArrays, setColorArrays] = useState([
//     '#00000000',
//     '#FF00FF00',
//     '#00FFFF00',
// ]);
  const [isCreatingNewProposal, setIsCreatingNewProposal] = useState(false);
  // const [disasterColor, setDisasterColor] = useState('#FFFFFF00'); // only handle color.
  // const [comments, setComments] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const {gameData} = usePixelawProvider();

  const handleColorChange = (color: any) => {
    setColor(color.hex);
  };

  const handleDisasterColorChange = (selectedOption: any) => {
    console.log(selectedOption.value);
    setColor(formatColorToRGBA(selectedOption.value)); // to submit the color.
    // setDisasterColor(selectedOption.value);
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
    const type = proposalType ===
        'Add Color' ? ProposalType.AddNewColor : ProposalType.ResetToWhiteByColor;
    if (gameData && gameData.account.account) {
      gameData.setup.systemCalls.createProposal(
        gameData.account.account,
        GAME_ID,
        type,
        hexRGBtoNumber(formatColorToRGB(color).replace('#', ''))
      ).then(() => {
        setIsCreatingNewProposal(false);
        // toastProposalAdded('Proposal Added'); // should be broadcast for everyone.
      }).catch(e => toastContractError(e))
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

  const colors = [
    '#00000000',
    '#FF00FF00',
    '#00FFFF00',
  ];
  const allowed_colors = useAllowedColors(GAME_ID);
  const allowed_colors_arrays = allowed_colors?.data ?? [];
  const colorArrays = allowed_colors_arrays.map(colorData => numRGBAToHex(colorData.color).toUpperCase());

  const colorOptionsFormatted = colorArrays.map(color => ({
    value: color,
    label: (
      <div className='flex items-center'>
        <div 
          className='w-6 h-6 rounded-md mr-2' 
          style={{ backgroundColor: formatColorToRGB(color)}}
        ></div>
        {formatColorToRGB(color).toUpperCase()}
      </div>
    ),
  }));

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'bg-gray-800',
      color: '#fff', // text-white
      borderColor: '#4A5568', // border-color
      boxShadow: 'none', // Remove default box shadow
      '&:hover': {
        borderColor: '#4A5568', // border-color on hover
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#fff', // text-white
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#4A5568', // bg-gray-700
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#2D3748' : '#bg0grat', // bg-gray-800 : bg-gray-700
      color: '#fff', // text-white
    }),
  };

  return (
    <div>
      {!isCreatingNewProposal && (
        <button onClick={() => setIsCreatingNewProposal(true)} className='bg-blue-600 text-white w-full px-10 py-3 rounded-md text-sm font-semibold shadow-lg hover:bg-blue-500 transition duration-300'>
          Create A New Proposal(5PX)
        </button>
      )}

      {isCreatingNewProposal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur flex justify-center items-center z-20'>
          {/* <div className='min-h-screen bg-gray-900 text-white flex flex-col'> */}
          {/* <div className='flex justify-center items-center flex-grow p-4'> */}
          <div ref={popupRef} className='w-1/3'>
            <div className='w-full max-w-xl bg-gray-800 p-12 rounded-lg shadow-lg text-white'>
              <h2 className='text-3xl font-bold mb-6'>New Proposal</h2>
              <div className='mb-4'>
                <label className='block text-lg mb-2'>Select Proposal Type</label>
                <select 
                  value={proposalType} 
                  onChange={(e) => setProposalType(e.target.value)}
                  className='w-full p-3 rounded-md bg-gray-700 text-white'
                >
                  <option value="Add Color">Add Color</option>
                  <option value="Reset To White">Reset To White</option>
                </select>
              </div>

              {proposalType === 'Add Color' && (
                <div className='mb-4'>
                  <label className='block text-lg mb-2'>Color (i.e. #00FFAA)</label>
                  <div className='flex items-center relative'>
                    <div
                      className='w-11 h-10 rounded-md mr-4 cursor-pointer'
                      style={{ backgroundColor: formatColorToRGB(color) }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    ></div>
                    <input
                      type="text"
                      value={formatColorToRGB(color)}
                      onChange={(e) => {
                        setColor(formatColorToRGBA(e.target.value.toUpperCase()));
                      }} // add 00
                      className='w-full p-2 rounded-md bg-gray-700 text-white'
                    />
                    {showColorPicker && (
                      <div className='absolute z-10' style={{ left: '-250px' }} ref={colorPickerRef}>
                        <SketchPicker color={color} onChange={handleColorChange} disableAlpha />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {proposalType === 'Reset To White' && (
                <div className='mb-4'>
                  <label className='block text-lg mb-2'>Choose a color to turn white on the canvas.</label>
                  <Select 
                    value={colorOptionsFormatted.find(option => formatColorToRGB(option.value) === color)}
                    onChange={handleDisasterColorChange}
                    options={colorOptionsFormatted}
                    styles={customStyles}
                    className='w-full rounded-md bg-gray-700 text-white'
                  />
                </div>
              )}

              <div className='flex justify-between mt-6'>
                <button onClick={() => setIsCreatingNewProposal(false)}
                  className='bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-300'
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-300'
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
