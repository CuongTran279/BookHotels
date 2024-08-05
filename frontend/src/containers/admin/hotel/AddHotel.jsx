import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { NumericFormat } from 'react-number-format';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ListCityAdmin } from '../../../components/data/ApiCityAdmin';
import { ListRoomTypeAdmin } from '../../../components/data/ApiRoomTypeAdmin';
import { Validate, AddHotelAdmin } from '../../../components/data/ApiHotelAdmin';
const AddHotel = () => {
    const [payload, setPayload] = useState({
        name: '',
        address: '',
        phone: '',
        description: '',
        city: '',
        roomType: '',
    });
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [file, setFile] = useState([]);
    const [invalidfield, setInvalidfield] = useState([]);
    const setInvalid = (e) => {
        const { name } = e.target;
        setInvalidfield({ ...invalidfield, [name]: undefined });
    };
    // Lấy thành phố
    const [city, setCity] = useState([]);
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const data = await ListCityAdmin();
                setCity(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchCities();
    }, []);
    // Lấy các loại phòng
    const [roomType, setRoomType] = useState([]);
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const data = await ListRoomTypeAdmin();
                setRoomType(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchRoomTypes();
    }, []);

    const setValue = (e) => {
        const { name, value } = e.target;
        setPayload({ ...payload, [name]: value });
    };

    const inputFile = (e) => {
        setFile(e.target.files[0]);
    };

    const handleOptionChange = (event) => {
        const value = event.target.value;
        setSelectedOptions((prevSelectedOptions) =>
            prevSelectedOptions.includes(value)
                ? prevSelectedOptions.filter((option) => option !== value)
                : [...prevSelectedOptions, value],
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!Validate(payload, setInvalidfield)) return;
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('address', payload.address);
        formData.append('phone', payload.phone);
        formData.append('city', payload.city);
        formData.append('description', payload.description);
        formData.append('options', selectedOptions);
        formData.append('image', file);
        const formObject = Object.fromEntries(formData.entries());
        console.log(formObject);
        try {
            await AddHotelAdmin(formObject);
            await Swal.fire({
                title: 'Thêm mới thành công',
                icon: 'success',
            });
            navigate('../hotel');
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
                    <h1 className="text-3xl text-black pb-6">Thêm mới Hotel</h1>
                    <div className="bg-white overflow-auto">
                        <form
                            className="p-10 bg-white rounded shadow-xl"
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div className="flex flex-row">
                                <div className="w-8/12">
                                    <div className="mt-2">
                                        <label className="block text-sm text-gray-600">Tên phòng</label>
                                        <input
                                            value={payload.name}
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            name="name"
                                            onChange={setValue}
                                            onFocus={setInvalid}
                                            placeholder="Nhập tên loại phòng"
                                        />
                                        {invalidfield.name && (
                                            <p className="text-red-600 italic">{invalidfield.name}</p>
                                        )}
                                    </div>

                                    <div className="container mt-2">
                                        <h2 className="block text-sm text-gray-600">Description</h2>
                                        <div className="border p-4">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                config={{
                                                    toolbar: [
                                                        'heading',
                                                        '|',
                                                        'bold',
                                                        'italic',
                                                        'link',
                                                        'bulletedList',
                                                        'numberedList',
                                                        'blockQuote',
                                                    ],
                                                }}
                                                name="description"
                                                data={payload.description}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    setPayload((prevState) => ({
                                                        ...prevState,
                                                        description: data,
                                                    }));
                                                }}
                                            />
                                        </div>
                                        {invalidfield.description && (
                                            <p className="text-red-600 italic">{invalidfield.description}</p>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <label className="block text-sm text-gray-600">Địa chỉ</label>
                                        <input
                                            value={payload.address}
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            name="address"
                                            onChange={setValue}
                                            onFocus={setInvalid}
                                            placeholder="Nhập địa chỉ khách sạn"
                                        />
                                        {invalidfield.address && (
                                            <p className="text-red-600 italic">{invalidfield.address}</p>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <label className="block text-sm text-gray-600">Thành phố</label>
                                        <select
                                            name="city"
                                            onChange={setValue}
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Chọn thành phố --</option>
                                            {city.map((value) => (
                                                <option key={value.id} value={value.name}>
                                                    {value.name}
                                                </option>
                                            ))}
                                        </select>
                                        {invalidfield.city && (
                                            <p className="text-red-600 italic">{invalidfield.city}</p>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <label className="block text-sm text-gray-600">Số điện thoại</label>
                                        <input
                                            value={payload.phone}
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            name="phone"
                                            onChange={setValue}
                                            onFocus={setInvalid}
                                            placeholder="Nhập số điện thoại "
                                        />
                                        {invalidfield.phone && (
                                            <p className="text-red-600 italic">{invalidfield.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 w-3/12 m-10">
                                    <div className="mt-2">
                                        <label className="block text-sm text-gray-600">Ảnh</label>
                                        <input
                                            accept="image/*"
                                            type="file"
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            name="image"
                                            onChange={inputFile}
                                        />
                                        {invalidfield.image && (
                                            <p className="text-red-600 italic">{invalidfield.image}</p>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-lg font-medium text-gray-800">
                                            Các loại phòng
                                        </label>
                                        <div className="flex flex-col gap-4 mt-2">
                                            {roomType.map((option) => (
                                                <label key={option.id} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        value={option.id}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        onChange={handleOptionChange}
                                                        checked={selectedOptions.includes(option.id.toString())}
                                                    />
                                                    <span className="text-gray-700">{option.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
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

export default AddHotel;
