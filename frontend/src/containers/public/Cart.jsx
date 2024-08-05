import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import Swal from 'sweetalert2';
import { bookAdminHotel } from '../../components/data/ApiBillAdmin';
const Cart = () => {
    const [payload, setPayload] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const navigate = useNavigate();
    const storedData = localStorage.getItem('user');
    const user = JSON.parse(storedData);
    const cartData = sessionStorage.getItem('cart');
    const cart = JSON.parse(cartData);
    const totalPrice = cart.reduce((acc, room) => acc + parseInt(room.price, 10), 0);
    const setValue = (e) => {
        const { name, value } = e.target;
        setPayload({ ...payload, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('email', payload.email);
        formData.append('phone', payload.phone);
        formData.append('price', totalPrice);
        formData.append('user', JSON.stringify(user));
        formData.append('cart', JSON.stringify(cart));

        try {
            const response = await bookAdminHotel(formData);
            const data = await response;
            window.location.href = data.payment_url;
            sessionStorage.removeItem('cart');
        } catch (err) {
            await Swal.fire({
                title: 'Đã có lỗi xảy ra',
                text: err.message,
                icon: 'error',
            });
        }
    };

    return (
        <div className="h-full">
            <div className="w-1124 m-auto flex justify-center flex-row">
                {cart && cart.length > 0 ? (
                    <div className="flex flex-row justify-center items-center gap-10 mb-5">
                        <div className="flex flex-col gap-10">
                            <div className="w-[800px] rounded-xl drop-shadow-xl bg-white px-14 py-5">
                                <p>Chi tiết liên lạc</p>
                                <div className="mt-2 flex flex-row gap-5 justify-between">
                                    <div className="w-2/4">
                                        <div className="mt-2">
                                            <label className="block text-sm text-gray-600">Họ và tên </label>
                                            <input
                                                value={payload.name}
                                                onChange={setValue}
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                name="name"
                                                placeholder="Nhập họ và tên"
                                            />
                                        </div>
                                        <div className="mt-2 ">
                                            <label className="block text-sm text-gray-600">Số điện thoại </label>
                                            <input
                                                value={payload.phone}
                                                onChange={setValue}
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                name="phone"
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-2/4">
                                        <div className="mt-2">
                                            <label className="block text-sm text-gray-600">Email </label>
                                            <input
                                                value={payload.email}
                                                onChange={setValue}
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                name="email"
                                                placeholder="Nhập email"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="text-[#5392f9] outline-[#5392f9] hover:bg-[#5392f9] hover:text-white ease-in duration-300 outline rounded-sm p-2 outline-1 mt-5"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                Tiến hành đặt phòng
                            </button>
                        </div>
                        <div className="flex flex-col gap-5">
                            {cart.map((hotel, i) => (
                                <div key={i} className="rounded-xl drop-shadow-xl bg-white px-5 py-5 w-[380px]">
                                    <div className=" mb-5 flex gap-10">
                                        <div className=" ">
                                            <img
                                                src={`http://localhost:8000/storage/${hotel.image}`}
                                                alt=""
                                                className="w-[100px] h-[100px]"
                                            />
                                        </div>
                                        <div className="">
                                            <p className="uppercase text-xl">{hotel.name}</p>
                                            <p>
                                                {hotel.address} - {hotel.city}
                                            </p>
                                            <p>{hotel.phone}</p>
                                            <label className="flex items-center rounded-xl drop-shadow-xl bg-white p-2">
                                                <div className="flex flex-col">
                                                    <span>{hotel.roomTypeName}</span>
                                                    <span>
                                                        {hotel.getIn} - {hotel.getOut}
                                                    </span>
                                                    <span>
                                                        {Number(hotel.price).toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        })}
                                                    </span>
                                                    <span>Số người : {hotel.capacity}</span>
                                                    <span>Số phòng : {hotel.quantity}</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="rounded-xl drop-shadow-xl bg-white px-5 py-5 w-[380px] flex">
                                <p>Tổng số tiền : </p>
                                <p className="text-red-600">
                                    {' '}
                                    {totalPrice.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center text-center">
                        <div className="grid grid-flow-row gap-10">
                            <div className="flex justify-center items-center text-center">
                                <img
                                    src="https://cdn6.agoda.net/images/kite-js/illustrations/athena/baggage/group.svg"
                                    alt="cart"
                                    className="w-[92px] h-[92px]"
                                />
                            </div>
                            <div>
                                <h1 className="uppercase font-medium text-3xl">
                                    Giỏ hàng của bạn trống, vui lòng chọn phòng
                                </h1>
                            </div>
                            <div>
                                <Link to="/">
                                    <Button
                                        text="Quay lại mua sắm"
                                        textColor="text-[#5392f9]"
                                        outline="outline-[#5392f9]"
                                        hoverBg="hover:bg-[#5392f9]"
                                        hoverText="hover:text-white"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
