import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ViewBill, updateBill } from '../../../components/data/ApiBillAdmin';
import { Load } from '../../../components';
const ListBill = () => {
    const [payload, setPayload] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const date = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cần cộng thêm 1
        const year = today.getFullYear();
        setCurrentDate(`${year}-${month}-${date}`);
    }, []);
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const data = await ViewBill();
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
        await updateBill(cityId, newStatus);
        window.location.reload();
    };
    console.log(currentDate);
    
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
                                            Id người dùng
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Thông tin người dùng
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Tên khách sạn
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            IMG
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Ngày tháng
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Tổng tiền
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Trạng thái
                                        </th>
                                        <th className=" py-3 px-4 uppercase font-semibold text-sm  text-center justify-center">
                                            Chỉnh sửa Trạng thái
                                        </th>
                                    </tr>
                                </thead>
                                {payload.length !== 0 ? (
                                    <tbody className="text-gray-700 text-center">
                                        {payload.map((city, i) => {
                                            return (
                                                <tr key={i} className="text-center border-b">
                                                    <td className=" py-3 px-4">{city.id}</td>
                                                    <td className=" py-3 px-4">{city.userId}</td>
                                                    <td className=" py-3 px-4">
                                                        {city.userName} - {city.phone}
                                                    </td>
                                                    <td className=" py-3 px-4">{city.name}</td>
                                                    <div className="text-center h-24 flex items-center justify-center">
                                                        <img
                                                            src={`http://localhost:8000/storage/${city.image}`}
                                                            alt={`city ${city.id} - Image ${i}`}
                                                            className="w-24 text-center "
                                                        />
                                                    </div>
                                                    <td className=" py-3 px-4">
                                                        {city.getIn} - {city.getOut}
                                                    </td>
                                                    <td className=" py-3 px-4">
                                                        {Number(city.total).toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        })}
                                                    </td>
                                                    <td>
                                                        <p className="text-red-500 font-bold">
                                                            {city.status === 0 && 'Chưa CheckIn'}
                                                        </p>
                                                        <p className="text-green-500 font-bold">
                                                            {city.status === 1 && 'Đã CheckIn'}
                                                        </p>
                                                        <p className="text-blue-500 font-bold">
                                                            {city.status === 2 && 'Đánh giá'}
                                                        </p>
                                                        <p className="text-amber-500 font-bold">
                                                            {city.status === 3 && 'Đã hoàn thành'}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <select
                                                            name=""
                                                            id=""
                                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={city.status}
                                                            onChange={(e) =>
                                                                handleStatusChange(city.id, e.target.value)
                                                            }
                                                        >
                                                            <option value="0" disabled={city.status > 0}>
                                                                Chưa CheckIn
                                                            </option>
                                                            <option
                                                                value="1"
                                                                disabled={city.status > 1 || currentDate < city.getIn}
                                                            >
                                                                Đã CheckIn
                                                            </option>
                                                            <option value="2" disabled={city.status > 2 || currentDate < city.getIn || currentDate < city.getOut}>
                                                                Đánh giá
                                                            </option>
                                                            <option value="3" disabled={city.status > 3 || currentDate < city.getIn || currentDate < city.getOut}>
                                                                Đã hoàn thành
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

export default ListBill;
