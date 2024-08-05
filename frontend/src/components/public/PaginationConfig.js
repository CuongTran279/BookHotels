// src/components/Pagination.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components';
const Pagination = ({hotel}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const hotelPerPage = 2;
    const lastIndex = currentPage * hotelPerPage;
    const firstIndex = lastIndex - hotelPerPage;
    const current = hotel.slice(firstIndex, lastIndex); // Use slice instead of splice
    const totalPage = Math.ceil(hotel.length / hotelPerPage);
    const numbers = [...Array(totalPage).keys()].map((n) => n + 1);
    const prePage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const changePage = (id) => {
        setCurrentPage(id);
    };
    return (
        <div >
            {current.map((hotel, i) => (
                <div key={i} className="p-[20px] h-[323px] w-[880px] border flex flex-row">
                    <div
                        style={{
                            backgroundImage: `url('http://localhost:8000/storage/${hotel.image}')`,
                        }}
                        className="w-5/12 bg-cover bg-center"
                    ></div>
                    <div className="w-6/12 flex flex-col gap-4 pl-5">
                        <p className="uppercase text-2xl">{hotel.name}</p>
                        <p>{hotel.address}</p>
                        <p>{hotel.city}</p>
                        <p>{hotel.phone}</p>
                        <p className="italic overflow-hidden h-[100px]">
                            <div dangerouslySetInnerHTML={{ __html: hotel.description }} />
                        </p>
                        <Link to={`/detail/${hotel.id}`}>
                            <Button
                                text="Chi tiết"
                                textColor="text-[#5392f9]"
                                outline="outline-[#5392f9]"
                                hoverBg="hover:bg-[#5392f9]"
                                hoverText="hover:text-white"
                            />
                        </Link>
                    </div>
                </div>
            ))}
            <div className="flex justify-center mt-5">
                <nav>
                    <ul className="flex list-none p-0">
                        <li className="mx-1">
                            <p
                                onClick={prePage}
                                className={`px-3 py-2 rounded-md border text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                Prev
                            </p>
                        </li>
                        {numbers.map((n, i) => (
                            <li className="mx-1" key={i}>
                                <p
                                    onClick={() => changePage(n)}
                                    className={`px-3 py-2 rounded-md border bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white ${currentPage === n ? 'opacity-50' : ''}`}
                                >
                                    {n}
                                </p>
                            </li>
                        ))}
                        <li className="mx-1">
                            <p
                                onClick={nextPage}
                                className={`px-3 py-2 rounded-md border text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer ${currentPage === totalPage ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                Next
                            </p>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Pagination;
