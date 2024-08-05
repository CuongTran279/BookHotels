import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Api from '../../../components/Api';
import { NumericFormat } from 'react-number-format';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import {Validate,AddRoomTypeAdmin} from '../../../components/data/ApiRoomTypeAdmin';
const AddRoomType = () => {
    const [payload, setPayload] = useState({
        name: '',
        description: '',
        price: '',
        capacity: '',
    });
    const { http } = Api();
    const [invalidfield, setInvalidfield] = useState({});
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    const setValue = (e) => {
        const { name, value } = e.target;
        setPayload((prevPayload) => ({
            ...prevPayload,
            [name]: value,
        }));
    };

    const inputFiles = (e) => {
        const uploadFiles = e.target.files;
        setFiles((prevFiles) => [...prevFiles, ...uploadFiles]);
    };

    const setInvalid = (e) => {
        const { name } = e.target;
        setInvalidfield((prev) => ({ ...prev, [name]: undefined }));
    };

    const renderFiles = () => (
        <div className="flex mt-5">
            {[...files].map((file, key) => (
                <div key={key}>
                    <img src={URL.createObjectURL(file)} width="200px" alt={`Preview ${key}`} />
                </div>
            ))}
        </div>
    );


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!Validate(payload,setInvalidfield)) return;
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('description', payload.description);
        formData.append('price', payload.price.replace(/₫|\./g, ''));
        formData.append('capacity', payload.capacity);
        files.forEach((file) => {
            formData.append('images[]', file);
        });
        try {
            await AddRoomTypeAdmin(formData);
            await Swal.fire({
                title: 'Thêm mới loại phòng thành công',
                icon: 'success',
            });
            navigate('../roomType');
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
                    <h1 className="text-3xl text-black pb-6">Thêm mới RoomType</h1>
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
                                        <label className="block text-sm text-gray-600">Giá - VNĐ</label>
                                        <NumericFormat
                                            name="price"
                                            value={payload.price}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="₫"
                                            onFocus={setInvalid}
                                            onValueChange={(values) => {
                                                setPayload((prev) => ({
                                                    ...prev,
                                                    price: values.value,
                                                }));
                                            }}
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập giá tiền"
                                            decimalScale={2}
                                            allowNegative={false}
                                        />
                                        {invalidfield.price && (
                                            <p className="text-red-600 italic">{invalidfield.price}</p>
                                        )}
                                    </div>

                                    <div className="mt-2">
                                        <label className="block text-sm text-gray-600">Số người tối đa 1 phòng</label>
                                        <NumericFormat
                                            name="capacity"
                                            value={payload.capacity}
                                            onFocus={setInvalid}
                                            onValueChange={(values) => {
                                                setPayload((prev) => ({
                                                    ...prev,
                                                    capacity: values.value,
                                                }));
                                            }}
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập số người 1 phòng"
                                            allowNegative={false}
                                        />
                                        {invalidfield.capacity && (
                                            <p className="text-red-600 italic">{invalidfield.capacity}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 w-3/12 m-10">
                                    <label className="block text-sm text-gray-600">Ảnh</label>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        multiple
                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="img"
                                        onChange={inputFiles}
                                        onFocus={setInvalid}
                                    />
                                    {renderFiles()}
                                    {invalidfield.img && <p className="text-red-600 italic">{invalidfield.img}</p>}
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

export default AddRoomType;
