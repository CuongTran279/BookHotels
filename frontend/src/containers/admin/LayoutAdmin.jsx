import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from './Header';

const LayoutAdmin = () => {
    const showprofile = () => {
        setShowProfile((prev) => !prev);
    };
    const [showProfile, setShowProfile] = useState(false);
    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    };
    return (
        <div className="bg-gray-100 font-family-karla flex">
            <aside className="fixed bg-[#3d68ff] h-screen w-1/6 sm:block shadow-xl top-0 left-0">
                <Header />
            </aside>
            <div className="flex flex-col h-screen w-5/6 absolute right-0  ">
                <header className="w-full items-center bg-white py-2 px-6 sm:flex">
                    <div className="relative w-1/2 flex justify-start ">
                        <Link to="/">
                            <p className="cursor-pointer hover:underline">Trở về trang chính</p>
                        </Link>
                    </div>
                    <div className="relative w-1/2 flex justify-end">
                        <button
                            onClick={showprofile}
                            className="relative z-10 w-12 h-12 rounded-full overflow-hidden border-4 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none"
                        >
                            <img
                                alt="img"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Qyi8tRpVjnQd4z_OEJgWuEyEBqX33bjKrdagthSYdwTR3xt3y3zFyQ8_PZjJkxrza4M&usqp=CAU"
                            />
                        </button>
                    </div>
                </header>
                <Outlet />
            </div>
            {!showProfile ? (
                <div></div>
            ) : (
                <div className="w-[250px] h-[80px]  px-14 py-5 fixed top-[10px] right-[50px]">
                    <nav className="flex flex-col w-48 p-4 bg-white rounded-xl drop-shadow-xl list-none">
                        <Link to="/profile">
                            <li className="p-2 hover:bg-gray-200 cursor-pointer">Thông tin cá nhân</li>
                        </Link>
                        <li onClick={logout} className="p-2 hover:bg-gray-200 cursor-pointer">
                            Đăng xuất
                        </li>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default LayoutAdmin;
