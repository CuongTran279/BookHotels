import React, { useEffect, useState } from 'react';
import { Button, Navbar } from '../../components';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../../components/Api';
import Swal from 'sweetalert2';
import { viewCart, deleteAdminCart, bookAdminHotel } from '../../components/data/ApiBillAdmin';

const Header = () => {
    const [users, setUser] = useState(null);
    const { getUser } = Api();
    const [show, setShow] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const cartData = sessionStorage.getItem('cart');
    const cartitem = JSON.parse(cartData);
    useEffect(() => {
        if (getUser) {
            setUser(getUser);
        }
    }, []);
    const storedData = localStorage.getItem('user');
    const user = JSON.parse(storedData);
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await viewCart(user.id);
                setCart(res);
            } catch (error) {
                console.error('Error fetching room type:', error);
            }
        };
        fetchCart();
    }, []);
    const [selectedHotels, setSelectedHotels] = useState([]);

    const handleCheckboxChange = (hotel) => {
        if (selectedHotels.includes(hotel)) {
            setSelectedHotels(selectedHotels.filter((h) => h !== hotel));
        } else {
            setSelectedHotels([...selectedHotels, hotel]);
        }
    };
    const totalQuantity = cart.reduce((acc, room) => acc + parseInt(room.quantity, 10), 0);
    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    };
    const handleClick = () => {
        if (!cartitem) {
            setShow((prev) => !prev);
        }
    };
    const buyCart = async (e) => {
        e.preventDefault();
        sessionStorage.setItem('cart', JSON.stringify(selectedHotels));
        navigate('/cart');
        window.location.reload();
    };

    const deleteCart = async (e) => {
        e.preventDefault();
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (confirm) {
            try {
                await deleteAdminCart(selectedHotels);
                await Swal.fire({
                    title: 'Xóa thành công',
                    icon: 'success',
                });
                window.location.reload();
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Xóa thất bại',
                    icon: 'error',
                });
            }
        }
    };

    const showprofile = () => {
        setShowProfile((prev) => !prev);
    };
    return (
        <div className="h-[60px] w-screen flex items-center bg-white justify-between px-8 drop-shadow-lg fixed">
            <div className="flex items-center justify-between gap-10">
                <Link to="/">
                    <img
                        src="https://insacmau.com/wp-content/uploads/2023/02/logo-FPT-Polytechnic-.png"
                        alt="logo"
                        className="w-[89px] h-[37px] object-contain cursor-pointer"
                    />
                </Link>
                <Navbar />
            </div>

            <div className="flex items-center gap-5 absolute right-10">
                {users ? (
                    <div className="flex items-center gap-5 flex-row">
                        <button
                            onClick={showprofile}
                            className="relative z-10 w-12 h-12 rounded-full overflow-hidden border-4 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none"
                        >
                            <img
                                alt="img"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Qyi8tRpVjnQd4z_OEJgWuEyEBqX33bjKrdagthSYdwTR3xt3y3zFyQ8_PZjJkxrza4M&usqp=CAU"
                            />
                        </button>

                        <div onClick={handleClick}>
                            <svg
                                width="24px"
                                height="24px"
                                viewBox="0 0 24.00 24.00"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`cursor-pointer relative top-3 right-2 ${cartitem ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    {' '}
                                    <path
                                        d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                                        stroke="#000000"
                                        stroke-width="0.624"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></path>{' '}
                                </g>
                            </svg>
                            <p className="bg-[#1947ee] text-white text-center rounded-full relative bottom-7 left-4">
                                {totalQuantity ? totalQuantity : '0'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-5">
                        <Link to="/login">
                            <Button
                                text="Tạo tài khoản"
                                textColor="text-[#5392f9]"
                                outline="outline-[#5392f9]"
                                hoverBg="hover:bg-[#5392f9]"
                                hoverText="hover:text-white"
                            />
                        </Link>
                        <Link to="/register">
                            <Button
                                text="Đăng nhập"
                                textColor="text-[#ff567d]"
                                outline="outline-[#ff567d]"
                                hoverBg="hover:bg-[#ff567d]"
                                hoverText="hover:text-white"
                            />
                        </Link>
                    </div>
                )}
            </div>
            {!showProfile ? (
                <div></div>
            ) : (
                <div className="w-[250px] h-[80px]  px-14 py-5 fixed top-[10px] right-[100px]">
                    <nav className="flex flex-col w-48 p-4 bg-white rounded-xl drop-shadow-xl list-none">
                        {users.role === 1 ? (
                            <Link to="/admin">
                                <li className="p-2 hover:bg-gray-200 cursor-pointer">Truy cập Admin</li>
                            </Link>
                        ) : null}
                        <Link to="/profile">
                            <li className="p-2 hover:bg-gray-200 cursor-pointer">Thông tin cá nhân</li>
                        </Link>
                        <li onClick={logout} className="p-2 hover:bg-gray-200 cursor-pointer">
                            Đăng xuất
                        </li>
                    </nav>
                </div>
            )}
            {!show ? (
                <div></div>
            ) : (
                <div className="w-[500px] h-[650px] rounded-xl drop-shadow-xl bg-white px-14 py-5 fixed top-[50px] right-[50px]">
                    <p className="uppercase text-2xl">Giỏ hàng của bạn</p>
                    <div className="drop-shadow-xl bg-white overflow-y-scroll w-[400px] h-[500px] mt-5">
                        {cart.length === 0 && (
                            <div className="flex justify-center text-center align-middle h-[500px]">
                                <div className="flex flex-col justify-center items-center text-center">
                                    <img
                                        src="https://cdn6.agoda.net/images/kite-js/illustrations/athena/baggage/group.svg"
                                        alt="cart"
                                        className="w-[92px] h-[92px]"
                                    />
                                    <h1 className="">Giỏ hàng của bạn trống , vui lòng chọn phòng</h1>
                                </div>
                            </div>
                        )}
                        {cart.length !== 0 &&
                            cart.map((hotel, i) => {
                                return (
                                    <div key={i} className="p-[20px] mb-5 border-b-2 flex gap-10">
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

                                            <label className="flex items-center space-x-2 border p-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    checked={selectedHotels.includes(hotel)}
                                                    onChange={() => handleCheckboxChange(hotel)}
                                                />
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
                                );
                            })}
                    </div>
                    {cart.length !== 0 && (
                        <div className="flex justify-between">
                            <button
                                className="text-[#5392f9] outline-[#5392f9] hover:bg-[#5392f9] hover:text-white ease-in duration-300 outline rounded-sm p-2 outline-1 mt-5"
                                type="submit"
                                onClick={buyCart}
                            >
                                Tiến hành đặt phòng
                            </button>
                            <button
                                onClick={deleteCart}
                                className="text-[#ff567d] outline-[#ff567d] hover:bg-[#ff567d] hover:text-white ease-in duration-300 outline rounded-sm p-2 outline-1 mt-5"
                            >
                                Xóa
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Header;
