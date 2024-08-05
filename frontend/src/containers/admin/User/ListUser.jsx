import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { viewUser, updateUser } from '../../../components/data/ApiAuth';
import { Load } from '../../../components';
const ListUser = () => {
    const [payload, setPayload] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const data = await viewUser();
                setPayload(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchCities();
    }, []);
    const handleStatusChange = async (cityId, newStatus) => {
        await updateUser(cityId, newStatus);
        window.location.reload();
    };

    if (loading) return <Load />;
    return (
        <div>
            <div className="w-full border-t flex flex-col">
                <main className="w-full flex-grow p-6">
                    <h1 className="text-3xl text-black pb-6">City</h1>
                    <div className="w-full mt-6">
                        <div className="bg-white ">
                            <table className="min-w-full bg-white ">
                                <thead className="bg-gray-800 text-white text-center justify-center">
                                    <tr>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Id
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Họ và tên
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Email
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Phone
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Address
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Vai trò
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Chỉnh sửa vai trò
                                        </th>
                                    </tr>
                                </thead>
                                {payload.length !== 0 ? (
                                    <tbody className="text-gray-700 text-center">
                                        {payload.map((city, i) => {
                                            return (
                                                <tr key={i} className="text-center border-b">
                                                    <td className=" py-3 px-4">{city.id}</td>
                                                    <td className=" py-3 px-4">{city.fullName}</td>
                                                    <td className=" py-3 px-4">{city.email}</td>
                                                    <td className=" py-3 px-4">{city.phone}</td>
                                                    <td className=" py-3 px-4">{city.address}</td>
                                                    <td>
                                                        <p className="text-red-500 font-bold">
                                                            {city.role === 0 && 'Người dùng'}
                                                        </p>
                                                        <p className="text-green-500 font-bold">
                                                            {city.role === 1 && 'Quản trị viên'}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <select
                                                            name=""
                                                            id=""
                                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={city.role}
                                                            onChange={(e) =>
                                                                handleStatusChange(city.id, e.target.value)
                                                            }
                                                        >
                                                            <option value="0">
                                                                Người dùng
                                                            </option>
                                                            <option value="1">
                                                                Quản trị viên
                                                            </option>
                                                        </select>
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

export default ListUser;
