import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Pagination = ({ hotels, handleDelete }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 2;
    const lastIndex = currentPage * hotelsPerPage;
    const firstIndex = lastIndex - hotelsPerPage;
    const current = hotels.slice(firstIndex, lastIndex);
    const totalPage = Math.ceil(hotels.length / hotelsPerPage);
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
        <tbody className="text-gray-700 text-center border-b">
            {current.map((hotel, i) => (
                <tr key={i} className="text-center border-b-2">
                    <td className=" py-3 px-4">{hotel.id}</td>
                    <td className=" py-3 px-4">{hotel.name}</td>
                    <td className=" py-3 px-4">
                        <img
                            src={`http://localhost:8000/storage/${hotel.image}`}
                            alt={`Image `}
                            className="w-24 text-center "
                        />
                    </td>
                    <td className=" py-3 px-4">{hotel.address}</td>
                    <td className=" py-3 px-4">{hotel.phone}</td>
                    <td className=" py-3 px-4">
                        <div dangerouslySetInnerHTML={{ __html: hotel.description }} />
                    </td>
                    <td className=" py-3 px-4 grid grid-rows text-left w-[500px]">
                        {hotel.rooms.map((room, key) => (
                            <div key={key} className="border-b mb-5">
                                <div className="grid grid-cols-2">
                                    {room.images.map((image, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={`http://localhost:8000/storage/${image}`}
                                            alt={room.name}
                                            className="w-28 mb-10 flex"
                                        />
                                    ))}
                                </div>
                                <h3 className="uppercase text-xl">{room.name}</h3>
                                <p className="italic">
                                    <div dangerouslySetInnerHTML={{ __html: room.description }} />
                                </p>
                                <p className="text-red-500">{room.price}</p>
                                <p>Capacity: {room.capacity}</p>
                                <p>Quantity: {room.quantity}</p>
                                <p>Status: {room.status}</p>
                            </div>
                        ))}
                    </td>
                    <td>
                        <button
                            onClick={() => navigate(`../updateHotel/${hotel.id}`)}
                            type=""
                            className="p-2 outline-none bg-[#4183ec] text-white rounded-md hover:bg-[#5392f9] mr-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(hotel.id)}
                            type=""
                            className="p-2 outline-none bg-[#c53456] text-white rounded-md hover:bg-[#ff567d]"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
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
        </tbody>
    );
};

export default Pagination;
