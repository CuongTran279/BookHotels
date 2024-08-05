import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Validate, AddCityAdmin } from '../../../components/data/ApiCityAdmin';
const AddCity = () => {
    const [payload, setPayload] = useState({ name: '' });
    const [invalidfield, setInvalidfield] = useState({});
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const setValue = (e) => {
        const { name, value } = e.target;
        setPayload((prevPayload) => ({
            ...prevPayload,
            [name]: value,
        }));
    };
    const setInvalid = (e) => {
        const { name } = e.target;
        setInvalidfield((prev) => ({ ...prev, [name]: undefined }));
    };
    const inputFile = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('image', file);
        if (!Validate(payload, setInvalidfield)) return;
        try {
            await AddCityAdmin(formData);
            await Swal.fire({
                title: 'Thêm mới thành công',
                icon: 'success',
            });
            navigate('../city');
        } catch (err) {
            Swal.fire({
                title: 'Đã có lỗi xảy ra',
                text: err.message,
                icon: 'error',
            });
        }
    };

    return (
        <div>
            <div className="w-full overflow-x-hidden border-t flex flex-col">
                <main className="w-full flex-grow p-6">
                    <h1 className="text-3xl text-black pb-6">Thêm mới City</h1>
                    <div className="bg-white overflow-auto">
                        <form
                            className="p-10 bg-white rounded shadow-xl"
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div className="flex flex-col">
                                <div className="mt-2">
                                    <label className="block text-sm text-gray-600">Tên thành phố</label>
                                    <input
                                        value={payload.name}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="name"
                                        onChange={setValue}
                                        onFocus={setInvalid}
                                        placeholder="Nhập tên thành phố"
                                    />
                                    {invalidfield.name && <p className="text-red-600 italic">{invalidfield.name}</p>}
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm text-gray-600">Ảnh</label>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="image"
                                        onChange={inputFile}
                                    />
                                    {file && (
                                        <div className="mt-2">
                                            <img src={URL.createObjectURL(file)} width="200px" alt="Preview" />
                                        </div>
                                    )}
                                    {invalidfield.image && <p className="text-red-600 italic">{invalidfield.image}</p>}
                                </div>
                            </div>
                            <div className="mt-5">
                                <button
                                    className="font-semibold uppercase p-2 bg-[#1947ee] text-white rounded-xl hover:bg-[#3d68ff]"
                                    type="submit"
                                >
                                    Thêm mới
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddCity;
