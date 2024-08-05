import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ListHotelAdmin, DeleteHotelAdmin } from '../../../components/data/ApiHotelAdmin';
import { Load } from '../../../components';
import Pagination from '../../../components/public/PaginateAdmin';
const ListHotel = () => {
    const [payload, setPayload] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const handleDelete = async (id) => {
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (confirm) {
            try {
                await DeleteHotelAdmin(id);
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
    useEffect(() => {
        const fetchHotel = async () => {
            const response = await ListHotelAdmin();
            setPayload(response);
            setLoading(false);
        };
        fetchHotel();
    }, []);
    if (loading) return <Load />;
    return (
        <div>
            <div className="w-full border-t flex flex-col">
                <main className="w-full flex-grow p-6">
                    <h1 className="text-3xl text-black pb-6">Hotel</h1>
                    <div className="w-full mt-6">
                        <div className="flex align-middle">
                            <p className="text-xl pb-3 relative w-1/2 flex justify-start">Danh sách</p>
                            <div className="pb-3 relative w-1/2 flex justify-end">
                                <Link to="../addHotel">
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
                                            Image
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Address
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Phone
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center w-60">
                                            Description
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Room
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                {payload.length !== 0 ? (
                                    <Pagination hotels={payload} handleDelete={handleDelete} />
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

export default ListHotel;
