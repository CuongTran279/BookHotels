import React, { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { Price } from '../data/ApiBillAdmin';
const SingleThumbSlider = ({value,setValue}) => {
    const [maxValue, setMaxValue] = useState(100);
    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const data = await Price();
                setMaxValue(data);
                setValue(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchPrice();
    }, []);
    return (
        <div className="flex flex-col items-center">
            <div className="w-full">
                <Range
                    values={[value]}
                    step={100000}
                    min={0}
                    max={maxValue}
                    onChange={(values) => setValue(values[0])}
                    renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            className="w-full h-2 bg-gray-300 rounded-lg"
                            style={{
                                background: getTrackBackground({
                                    values: [value],
                                    colors: ['#548BF4', '#ccc'],
                                    min: 0,
                                    max: maxValue,
                                }),
                            }}
                        >
                            {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div {...props} className="w-4 h-4 bg-blue-600 rounded-full focus:outline-none" />
                    )}
                />
            </div>
            <label className="mb-2 text-gray-700 mr-4">Giá trị: {value}</label>
        </div>
    );
};

export default SingleThumbSlider;
