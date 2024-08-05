import React, { useState } from 'react';

const CheckBox = ({ payload }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (checked) {
            setSelectedCategories([...selectedCategories, name]);
        } else {
            setSelectedCategories(selectedCategories.filter((category) => category !== name));
        }
    };
    return (
        <div>
            {payload.map((roomType) => {
                <div key={roomType.id} className="mb-2">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name={roomType.name}
                            onChange={handleCheckboxChange}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">{roomType.name}</span>
                    </label>
                </div>;
            })}
        </div>
    );
};

export default CheckBox;
