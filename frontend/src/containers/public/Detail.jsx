import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { hotelById, hotelByCity } from '../../components/data/ApiHotelAdmin';
import { Load } from '../../components';
import Swal from 'sweetalert2';
import { NumericFormat } from 'react-number-format';
import Pagination from '../../components/public/PaginationConfig';
import { ValidateMain, SearchRoom, addCart, commentByHotel } from '../../components/data/ApiBillAdmin';
const Detail = () => {
    const { id } = useParams();
    const [validationMessage, setValidationMessage] = useState('');
    const [payload, setPayload] = useState({
        name: '',
        address: '',
        phone: '',
        description: '',
        rooms: [],
    });
    const [date, setDate] = useState({
        getIn: '',
        getOut: '',
        people: '',
        quantity: '',
    });
    const [night, setNight] = useState([]);
    const setValue = (e) => {
        const { name, value } = e.target;
        setDate({ ...date, [name]: value });
    };
    const [hotelCity, setHotelCity] = useState([]);
    const [search, setSearch] = useState([]);
    const [loadSearch, setLoadSearch] = useState(true);
    const [loading, setLoading] = useState(true);
    const [cmt, setCmt] = useState([]);
    useEffect(() => {
        const session = sessionStorage.getItem('search');
        if (session) {
            setDate(JSON.parse(session));
        }
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
    useEffect(() => {
        const session = sessionStorage.getItem('search');
        if (session) {
            setDate(JSON.parse(session));
        }
    }, []);
    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const hotel = await hotelByCity(id);
                setHotelCity(hotel);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching room type:', error);
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id]);
    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const hotel = await commentByHotel(id);
                setCmt(hotel);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching room type:', error);
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id]);
    const totalQuantity = payload.rooms.reduce((acc, room) => acc + parseInt(room.quantity, 10), 0);
    const timeNight = () => {
        const getIn = new Date(date.getIn);
        const getOut = new Date(date.getOut);
        const diffTime = Math.abs(getOut - getIn);
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNight(nights);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = ValidateMain(date);
        setValidationMessage(message);
        if (message) return;
        try {
            const searchRoom = await SearchRoom(id, date);
            sessionStorage.setItem('search', JSON.stringify(date));
            timeNight();
            setSearch(searchRoom);
            setLoadSearch(false);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoadSearch(true);
        }
    };
    const storedData = localStorage.getItem('user');
    const user = JSON.parse(storedData);
    const handleBook = async (e, room) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('hotelId', room.id);
        formData.append('roomTypeId', room.roomTypeId);
        formData.append('getIn', date.getIn);
        formData.append('getOut', date.getOut);
        formData.append('people', date.people);
        formData.append('quantity', date.quantity);
        formData.append('price', (room.roomTypePrice * night) * date.quantity);
        formData.append('userId', user.id);
        const formObject = Object.fromEntries(formData.entries());
        console.log(formObject);
        try {
            await addCart(formData);
            await Swal.fire({
                title: 'Thêm vào giỏ hàng thành công',
                icon: 'success',
            });
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };
    if (loading) return <Load />;
    return (
        <div className="flex flex-col justify-center items-center gap-10 mb-5 mt-5 w-1124 m-auto">
            <div className="flex flex-row">
                <div className="mt-2 w-7/12 h-[600px]">
                    <img src={`http://localhost:8000/storage/${payload.image}`} alt="" className="h-full w-full" />
                </div>
                <div className="w-5/12 p-5">
                    <div className=" p-5 border rounded-xl">
                        <p className="uppercase text-7xl mb-2">{payload.name}</p>
                        <hr />
                        <p>{payload.address}</p>
                        <p className="text-2xl uppercase mb-2">{payload.city}</p>
                        <hr />
                        <p className="italic mb-2 text-lg">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: payload.description,
                                }}
                            />
                        </p>
                        <hr />
                        <p className="italic mb-2">{payload.phone}</p>
                    </div>
                    <p className="text-sm mt-2">Số phòng còn lại : {totalQuantity}</p>
                    <div className="p-5 border rounded-xl">
                        <form action="" onSubmit={handleSubmit} className="flex flex-row gap-10 mb-5">
                            <div>
                                <div className="flex flex-col gap-2">
                                    <label for="">Ngày đến</label>
                                    <input
                                        value={date.getIn}
                                        onChange={setValue}
                                        name="getIn"
                                        type="date"
                                        className="outline-none border border-[#dddfe2] rounded-md p-5 focus:drop-shadow-blue "
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label for="">Ngày đi</label>
                                    <input
                                        value={date.getOut}
                                        onChange={setValue}
                                        name="getOut"
                                        type="date"
                                        className="outline-none border border-[#dddfe2] rounded-md p-5 focus:drop-shadow-blue"
                                    />
                                </div>
                                <div className="mt-2">
                                    <button
                                        className="font-semibold uppercase p-2 bg-[#1947ee] text-white rounded-xl hover:bg-[#3d68ff]"
                                        type="submit"
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-col gap-2">
                                    <label for="">Số người</label>
                                    <NumericFormat
                                        value={date.people}
                                        onValueChange={(values) => setDate({ ...date, people: values.value })}
                                        name="people"
                                        className="outline-none border border-[#dddfe2] rounded-md p-5 focus:drop-shadow-blue"
                                        placeholder="Nhập số lượng người lớn"
                                        min={0}
                                        allowNegative={false}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label for="">Số phòng</label>
                                    <NumericFormat
                                        value={date.quantity}
                                        onValueChange={(values) => setDate({ ...date, quantity: values.value })}
                                        name="quantity"
                                        className="outline-none border border-[#dddfe2] rounded-md p-5 focus:drop-shadow-blue"
                                        placeholder="Nhập số lượng người lớn"
                                        min={0}
                                        allowNegative={false}
                                    />
                                </div>
                                {validationMessage && <p className="italic text-red-600">{validationMessage}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center ">
                {loadSearch === true && (
                    <div>
                        <div className="text-center mb-5">
                            <p className="text-2xl uppercase mb-2">Các loại phòng hiện có </p>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            {payload.rooms &&
                                payload.rooms.map((hotel, i) => (
                                    <div key={i} className="p-[20px] h-[323px] w-[500px] border flex flex-row mb-5">
                                        <div className="grid grid-cols-2 gap-2 h-10">
                                            {hotel.images.map((image, imgIndex) => (
                                                <img
                                                    src={`http://localhost:8000/storage/${image}`}
                                                    alt=""
                                                    className="w-[100px] h-[100px]"
                                                />
                                            ))}
                                        </div>
                                        <div className="w-6/12 h-full flex flex-col gap-4 overflow-hidden pl-5">
                                            <p className="uppercase text-2xl">{hotel.name}</p>
                                            <p className="italic overflow-hidden h-[90px]">
                                                <div dangerouslySetInnerHTML={{ __html: hotel.description }} />
                                            </p>
                                            <div>
                                                <p
                                                    className="font-semibold uppercase p-2 bg-[#1947ee] text-white rounded-xl hover:bg-[#3d68ff]"
                                                    type="submit"
                                                >
                                                    Nhập thông tin để đặt phòng
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-5">
                    {search.length == 0 && loadSearch === false && (
                        <div className="text-red-500">Không tìm thấy phòng</div>
                    )}
                    {search && !validationMessage ? (
                        search.map((room, i) => {
                            const priceRoom = (room.roomTypePrice * night) * date.quantity;
                            return (
                                <form action="" onSubmit={(e) => handleBook(e, room)}>
                                    <div key={i} className="p-[20px] h-[323px] w-[500px] border flex flex-row mb-5">
                                        <div className="grid grid-cols-2 gap-2 h-10">
                                            {room.roomTypeImage.split('|') &&
                                                room.roomTypeImage
                                                    .split('|')
                                                    .map((image, imgIndex) => (
                                                        <img
                                                            src={`http://localhost:8000/storage/${image}`}
                                                            alt=""
                                                            className="w-[100px] h-[100px]"
                                                        />
                                                    ))}
                                        </div>
                                        <div className="w-6/12 h-full flex flex-col gap-4 overflow-hidden pl-5">
                                            <p className="uppercase text-2xl">{room.roomTypeName}</p>
                                            <p className="italic overflow-hidden h-[90px]">
                                                <div dangerouslySetInnerHTML={{ __html: room.roomTypeDescription }} />
                                            </p>
                                            <p>
                                                Giá:
                                                {priceRoom.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </p>
                                            <p>Số lượng còn lại : {room.count}</p>
                                            <div>
                                                <button
                                                    className="text-[#5392f9] outline-[#5392f9] hover:bg-[#5392f9] hover:text-white ease-in duration-300 outline rounded-sm p-2 outline-1 "
                                                    type="submit"
                                                >
                                                    Đặt phòng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            );
                        })
                    ) : (
                        <div className="text-red-500">Không tìm thấy phòng</div>
                    )}
                </div>
            </div>
            <div className="flex flex-col justify-center w-full">
                <table className="min-w-full bg-white ">
                    <thead className="bg-gray-800 text-white text-center justify-center">
                        <tr>
                            <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                Tên người dùng
                            </th>
                            <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                Nội dung
                            </th>
                        </tr>
                    </thead>

                    {cmt.length !== 0 ? (
                        <tbody className="text-gray-700 text-center">
                            {cmt.map((city, i) => {
                                return (
                                    <tr key={i} className="text-center border-b">
                                        <td className=" py-3 px-4">{city.fullName}</td>
                                        <td className=" py-3 px-4">{city.msg}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    ) : (
                        <h1 className="uppercase"> Chưa có bản ghi nào </h1>
                    )}
                </table>
            </div>
            <div className="">
                <div className="text-center mb-5">
                    <p className="text-2xl uppercase mb-2">Khách sạn cùng thành phố</p>
                </div>
                <Pagination hotel={hotelCity} />
            </div>
        </div>
    );
};

export default Detail;
