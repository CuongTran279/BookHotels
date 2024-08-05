import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Load } from '../../../components';
import { ListRoomTypeAdmin, DeleteRoomTypeAdmin } from '../../../components/data/ApiRoomTypeAdmin';
const ListRoomType = () => {
    const [payload, setPayload] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Hiển thị
    useEffect(() => {
        const fetchRoomType = async () => {
            try {
                const data = await ListRoomTypeAdmin();
                setPayload(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchRoomType();
    }, []);
    // Xóa
    const handleDelete = async (id) => {
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (confirm) {
            try {
                await DeleteRoomTypeAdmin(id);
                Swal.fire({
                    title: 'Xóa thành công',
                    icon: 'success',
                }).then(() => {
                    window.location.reload();
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Xóa thất bại',
                    icon: 'error',
                });
            }
        }
    };
    if (loading)
        return (
            <Load/>
        );
    return (
        <div>
            <div className="w-full border-t flex flex-col">
                <main className="w-full flex-grow p-6">
                    <h1 className="text-3xl text-black pb-6">RoomType</h1>
                    <div className="w-full mt-6">
                        <div className="flex align-middle">
                            <p className="text-xl pb-3 relative w-1/2 flex justify-start">Danh sách</p>
                            <div className="pb-3 relative w-1/2 flex justify-end">
                                <Link to="../addRoomType">
                                    <button className="font-semibold uppercase p-5 bg-[#1947ee] text-white rounded-xl hover:bg-[#3d68ff]">
                                        Thêm mới
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white ">
                            <table className="min-w-full bg-white ">
                                <thead className="bg-gray-800 text-white text-center justify-center">
                                    <tr>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            ID
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Name
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            IMG
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Description
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Price
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Capicity
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                {payload.length !== 0 ? (
                                    <tbody className="text-gray-700 text-center">
                                        {payload.map((room, i) => {
                                            return (
                                                <tr key={i} className="text-center border-b">
                                                    <td className=" py-3 px-4">{room.id}</td>
                                                    <td className=" py-3 px-4">{room.name}</td>
                                                    {Array.isArray(room.images) ? (
                                                        room.images.map((img, idx) => (
                                                            <div className="w-24 h-24" key={idx}>
                                                                <img
                                                                    src={`http://localhost:8000/storage/${img}`}
                                                                    alt={`Room ${room.id} - Image ${idx}`}
                                                                />
                                                            </div>
                                                        ))
                                                    ) : typeof room.images === 'string' && room.images.includes(',') ? (
                                                        room.images.split(',').map((img, idx) => (
                                                            <div className="w-24 h-24" key={idx}>
                                                                <img
                                                                    src={`http://localhost:8000/storage/${img}`}
                                                                    alt={`Room ${room.id} - Image ${idx}`}
                                                                />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>No images</p>
                                                    )}
                                                    <td className=" w-72 whitespace-normal break-words truncate">
                                                        <div dangerouslySetInnerHTML={{ __html: room.description }} />
                                                    </td>
                                                    <td className=" py-3 px-4">{room.price}</td>
                                                    <td className=" py-3 px-4">{room.capacity}</td>
                                                    <td className="gap-5">
                                                        <button
                                                            onClick={() => navigate(`../updateRoomType/${room.id}`)}
                                                            type=""
                                                            className="p-2 outline-none bg-[#4183ec] text-white rounded-md hover:bg-[#5392f9] mr-2"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(room.id)}
                                                            type=""
                                                            className="p-2 outline-none bg-[#c53456] text-white rounded-md hover:bg-[#ff567d]"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                ) : (
                                    <h1 className="uppercase"> Chưa có bản ghi nào </h1>
                                )}
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ListRoomType;
