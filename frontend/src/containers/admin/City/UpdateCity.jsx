import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Validate, cityById, UpdateCityAdmin } from '../../../components/data/ApiCityAdmin';
import { Load } from '../../../components';
const UpdateCity = () => {
    const [payload, setPayload] = useState({
        name: '',
    });
    const { id } = useParams();
    const [loading,setLoading] =useState(true)
    const [invalidfield, setInvalidfield] = useState([]);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const inputFile = (e) => {
        setFile(e.target.files[0]);
    };
    const setValue = (e) => {
        const { name, value } = e.target;
        setPayload({ ...payload, [name]: value });
    };
    useEffect(() => {
        const fetchCity = async () => {
            try {
                const city = await cityById(id);
                setPayload(city);
                setLoading(false)
            } catch (error) {
                console.error('Error fetching room type:', error);
                setLoading(false)
            }
        };

        fetchCity();
    }, [id]);
    console.log(payload);
    const renderFiles = () => (
        <div className="flex mt-5">
            <div>
                <img src={`http://localhost:8000/storage/${payload.image}`} width="200px" />
            </div>
        </div>
    );
    const setInvalid = (e) => {
        const { name } = e.target;
        setInvalidfield((prev) => ({ ...prev, [name]: undefined }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!Validate(payload, setInvalidfield)) return;
        const formData = new FormData();
        formData.append('name', payload.name);
        if(file){
            formData.append('image', file);
        }
        try {
            await UpdateCityAdmin(id, formData);
            await Swal.fire({
                title: 'Thay đổi thành phố thành công',
                icon: 'success',
            });
            navigate('../city');
        } catch (error) {
            Swal.fire({
                title: 'Đã có lỗi xảy ra',
                text: error.message,
                icon: 'error',
            });
        }
    };
    if (loading) return <Load />;
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
                                    {renderFiles()}
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

export default UpdateCity;
