import React from 'react';

const InputForm = ({ text, type, dropShadow, value, setValue, setInvalidfield }) => {
    return (
        <div className="mt-2 flex flex-col">
            <label for="">{text}</label>
            <input
                type="text"
                className={`border outline-none p-3 mt-1 rounded-sm ${dropShadow}`}
                value={value}
                onChange={(e) => {
                    setValue((prevValue) => ({ ...prevValue, [type]: e.target.value }));
                }}
                onFocus={(e) => {
                    setInvalidfield((prevEroor) => ({ ...prevEroor, [type]: undefined }));
                }}
            ></input>
        </div>
    );
};

export default InputForm;
