import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { hotelById, Validate, UpdateHotelAdmin } from '../../../components/data/ApiHotelAdmin';
import { ListCityAdmin } from '../../../components/data/ApiCityAdmin';
import { Load } from '../../../components';
const UpdateHotel = () => {
    const [payload, setPayload] = useState({
        name: '',
        address: '',
        phone: '',
        description: '',
        rooms: [],
    });
    const [file, setFile] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [invalidfield, setInvalidfield] = useState([]);
    const setValue = (e) => {
        const { name, value } = e.target;
        setPayload((prevValue) => ({ ...prevValue, [name]: value }));
    };
    const inputFile = (e) => {
        setFile(e.target.files[0]);
    };
    const setValueRoom = (index, field, value) => {
        const updatedRooms = payload.rooms.map((room, i) => (i === index ? { ...room, [field]: value } : room));
        setPayload({ ...payload, rooms: updatedRooms });
    };
    const setInvalid = (e) => {
        const { name } = e.target;
        setInvalidfield({ ...invalidfield, [name]: undefined });
    };
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
    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const hotel = await hotelById(id);
                setPayload(hotel[0]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching room type:', error);
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);
    console.log(payload);
    const updateHotel = async (e) => {
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('address', payload.address);
        formData.append('city', payload.city);
        formData.append('phone', payload.phone);
        formData.append('description', payload.description);
        if (file) {
            formData.append('image', file);
        }
        formData.append('rooms', JSON.stringify(payload.rooms));
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        try {
            await UpdateHotelAdmin(id, formData);
            await Swal.fire({
                title: 'Thay đổi khách sạn thành công',
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
    if (loading) return <Load />;
    return (
        <div>
            <div className="w-full overflow-x-hidden border-t flex flex-col">
                <main className="w-full flex-grow p-6">
                    <h1 className="text-3xl text-black pb-6">Sửa Hotel</h1>
                    <div className="bg-white overflow-auto p-2">
                        <div className="flex flex-row gap-5">
                            <div className="w-3/6">
                                <div className="mt-2">
                                    <label className="block text-sm text-gray-600">Ảnh</label>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        multiple
                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="img"
                                        onChange={inputFile}
                                        onFocus={setInvalid}
                                    />
                                    <img
                                        src={`http://localhost:8000/storage/${payload.image}`}
                                        alt=""
                                        className="mt-2 w-[100px] h-[100px]"
                                    />
                                    {invalidfield.img && <p className="text-red-600 italic">{invalidfield.img}</p>}
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm text-gray-600">Tên hotel</label>
                                    <input
                                        value={payload.name}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="name"
                                        onChange={setValue}
                                        onFocus={setInvalid}
                                        placeholder="Nhập tên loại phòng"
                                    />
                                    {invalidfield.name && <p className="text-red-600 italic">{invalidfield.name}</p>}
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm text-gray-600">Địa chỉ</label>
                                    <input
                                        value={payload.address}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="address"
                                        onChange={setValue}
                                        onFocus={setInvalid}
                                        placeholder="Nhập địa chỉ"
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
                                        {city.map((value) =>
                                            value.name === payload.city ? (
                                                <option key={value.id} value={value.name} selected>
                                                    {value.name}
                                                </option>
                                            ) : (
                                                <option key={value.id} value={value.name}>
                                                    {value.name}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                    {invalidfield.city && <p className="text-red-600 italic">{invalidfield.city}</p>}
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm text-gray-600">SDT</label>
                                    <input
                                        value={payload.phone}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="phone"
                                        onChange={setValue}
                                        onFocus={setInvalid}
                                        placeholder="Nhập địa chỉ"
                                    />
                                    {invalidfield.phone && <p className="text-red-600 italic">{invalidfield.phone}</p>}
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
                                <button
                                    onClick={updateHotel}
                                    className="mt-2 font-semibold uppercase p-2 bg-[#1947ee] text-white rounded-xl hover:bg-[#3d68ff]"
                                >
                                    Cập nhật
                                </button>
                            </div>
                            <div className="mt-2 w-3/6">
                                <div className="mt-2">
                                    {payload.rooms &&
                                        payload.rooms.map((room, index) => (
                                            <div key={index} className="border mb-5 p-2">
                                                <h3>
                                                    Room Type:
                                                    <input
                                                        value={room.name}
                                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        name="name"
                                                        onChange={(e) => setValueRoom(index, 'name', e.target.value)}
                                                        onFocus={setInvalid}
                                                        placeholder="Nhập số người 1 phòng"
                                                        disabled
                                                    />
                                                </h3>
                                                <div className="mt-2 grid grid-cols-2">
                                                    {room.images.map((image, imgIndex) => (
                                                        <img
                                                            key={imgIndex}
                                                            src={`http://localhost:8000/storage/${image}`}
                                                            alt={room.name}
                                                            className="w-28 mb-10 flex"
                                                        />
                                                    ))}
                                                </div>

                                                <p>
                                                    Description:
                                                    <CKEditor editor={ClassicEditor} data={room.description} disabled />
                                                </p>
                                                <p>
                                                    Capacity:
                                                    <input
                                                        type="number"
                                                        value={room.capacity}
                                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        name="capacity"
                                                        onChange={(e) =>
                                                            setValueRoom(index, 'capacity', e.target.value)
                                                        }
                                                        onFocus={setInvalid}
                                                        placeholder="Nhập số người 1 phòng"
                                                    />
                                                </p>
                                                <p>
                                                    Price:
                                                    <input
                                                        type="number"
                                                        value={room.price}
                                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        name="price"
                                                        onChange={(e) => setValueRoom(index, 'price', e.target.value)}
                                                        onFocus={setInvalid}
                                                        placeholder="Nhập giá"
                                                    />
                                                </p>
                                                <div className="">
                                                    <label htmlFor="">Quantity: </label>
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={room.quantity}
                                                        onChange={(e) =>
                                                            setValueRoom(index, 'quantity', e.target.value)
                                                        }
                                                        name="quantity"
                                                        onFocus={setInvalid}
                                                        placeholder="Nhập số người 1 phòng"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UpdateHotel;
