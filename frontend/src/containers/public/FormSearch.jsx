import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { Button } from '../../components';
import { ValidateMain, searchMainRoom } from '../../components/data/ApiBillAdmin';
const FormSearch = () => {
    const [validationMessage, setValidationMessage] = useState('');
    const [date, setDate] = useState({
        search: '',
        getIn: '',
        getOut: '',
        people: '',
        quantity: '',
    });
    const [night, setNight] = useState([]);
    const [searchHotel, setSearchHotel] = useState([]);
    const [loadSearch, setLoadSearch] = useState(true);
    const [loading, setLoading] = useState(true);
    const setValue = (e) => {
        const { name, value } = e.target;
        setDate({ ...date, [name]: value });
    };
    const timeNight = () => {
        const getIn = new Date(date.getIn);
        const getOut = new Date(date.getOut);
        const diffTime = Math.abs(getOut - getIn);
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNight(nights);
    };
    useEffect(() => {
        const session = sessionStorage.getItem('search');
        if(session){
            setDate(JSON.parse(session));
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = ValidateMain(date);
        setValidationMessage(message);
        if (message) return;
        try {
            const searchRoom = await searchMainRoom(date);
            timeNight();
            setSearchHotel(searchRoom);
            setLoadSearch(false);
            setLoading(false);
            sessionStorage.setItem('search', JSON.stringify(date));
        } catch (err) {
            console.error(err);
            setLoadSearch(true);
        }
    };
    return (
        <div className="flex flex-col gap-32">
            <div className="h-[300px] w-1124 rounded-xl drop-shadow-xl bg-white flex justify-center flex-col px-14 mt-[-100px]">
                <div className="mt-2">
                    <h2 className="font-medium text-base">Tìm kiếm phòng</h2>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <div className="mt-2 flex items-center">
                        <input
                            value={date.search}
                            onChange={setValue}
                            name="search"
                            type="text"
                            placeholder="Nhập điểm du lịch và khách sạn"
                            className="h-[66px] w-[1150px] outline-none  border-b-[1px] focus:border-b-[#5392f9] p-5"
                        />
                    </div>
                    <div className="mt-10 flex flex-row gap-5 justify-between">
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
                        <div className="flex flex-col gap-2">
                            <label for="">Số phòng</label>
                            <NumericFormat
                                value={date.quantity}
                                onValueChange={(values) => setDate({ ...date, quantity: values.value })}
                                name="quantity"
                                className="outline-none border border-[#dddfe2] rounded-md p-5 focus:drop-shadow-blue"
                                placeholder="Nhập số lượng phòng"
                                min={0}
                                allowNegative={false}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label for="">Số người</label>
                            <NumericFormat
                                value={date.people}
                                onValueChange={(values) => setDate({ ...date, people: values.value })}
                                name="people"
                                className="outline-none border border-[#dddfe2] rounded-md p-5 focus:drop-shadow-blue"
                                placeholder="Nhập số lượng người"
                                min={0}
                                allowNegative={false}
                            />
                        </div>
                    </div>
                    <div className="mt-5 flex justify-center items-center">
                        <div>
                            <button
                                className="text-[#5392f9] outline-[#5392f9] hover:bg-[#5392f9] hover:text-white ease-in duration-300 outline rounded-sm p-2 outline-1 "
                                type="submit"
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                    {validationMessage && <p className="italic text-red-600">{validationMessage}</p>}
                </form>
            </div>
            {loadSearch === false && (
                <div className="h-[500px] w-1124 rounded-xl drop-shadow-xl bg-white px-14 mt-[-100px] overflow-scroll">
                    {searchHotel.length == 0 && loadSearch === false && (
                        <div className="text-red-500">Không tìm thấy phòng</div>
                    )}
                    {searchHotel ? (
                        searchHotel.map((room, i) => {
                            return (
                                <div key={i} className="p-[20px] h-full border flex flex-row mb-5">
                                    <div className="w-[100px]">
                                        {room.image.split('|') &&
                                            room.image
                                                .split('|')
                                                .map((image, imgIndex) => (
                                                    <img
                                                        src={`http://localhost:8000/storage/${image}`}
                                                        alt=""
                                                        className="w-[100px] h-[100px]"
                                                    />
                                                ))}
                                    </div>
                                    <div className=" h-full w-full flex flex-col gap-4 overflow-hidden pl-5">
                                        <p className="uppercase text-2xl">{room.name}</p>
                                        <p className="italic overflow-hidden h-[60px]">
                                            <div dangerouslySetInnerHTML={{ __html: room.description }} />
                                        </p>
                                        <hr />
                                        <p>{room.phone}</p>
                                        <p>{room.address}</p>
                                        <p>{room.city}</p>
                                        <hr />
                                        <p className="uppercase text-2xl">Các phòng còn trống</p>
                                        <div className="flex flex-col gap-2">
                                            {room.rooms.map((roomType, i) => {
                                                return (
                                                    <div key={i} className="flex flex-row gap-5">
                                                        <p>{roomType.name} -</p>
                                                        <p>Giá : {(roomType.price * night).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} -</p>
                                                        <p>Số lượng : {roomType.quantity}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div>
                                            <Link to={`/detail/${room.id}`}>
                                                <Button
                                                    text="Đặt phòng"
                                                    textColor="text-[#5392f9]"
                                                    outline="outline-[#5392f9]"
                                                    hoverBg="hover:bg-[#5392f9]"
                                                    hoverText="hover:text-white"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-red-500">Không tìm thấy phòng</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FormSearch;
