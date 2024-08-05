import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {ListCityAdmin,DeleteCityAdmin} from '../../../components/data/ApiCityAdmin';
import { Load } from '../../../components';
const ListCity = () => {
    const [payload, setPayload] = useState([]);
    const navigate = useNavigate();
    const [loading,setLoading] =useState(true)
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const data = await ListCityAdmin();
                setPayload(data);
                setLoading(false)
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        };
        
        fetchCities();
    }, []);
    const handleDelete =async (id) => {
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa?');
        if (confirm) {
            try{
                await DeleteCityAdmin(id);
                Swal.fire({
                    title: 'Xóa thành công',
                    icon: 'success',
                }).then(() => {
                    window.location.reload();
                });
            }catch(error){
                console.error(error);
                Swal.fire({
                    title: 'Xóa thất bại',
                    icon: 'error',
                });
            }
        }
    };
    if (loading) return <Load />;
    return (
        <div>
            <div className="w-full border-t flex flex-col">
                <main className="w-full flex-grow p-6">
                    <h1 className="text-3xl text-black pb-6">City</h1>
                    <div className="w-full mt-6">
                        <div className="flex align-middle">
                            <p className="text-xl pb-3 relative w-1/2 flex justify-start">Danh sách</p>
                            <div className="pb-3 relative w-1/2 flex justify-end">
                                <Link to="../addCity">
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
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                {payload.length !== 0 ? (
                                    <tbody className="text-gray-700 text-center">
                                        {payload.map((city, i) => {
                                            return (
                                                <tr key={i} className="text-center border-b">
                                                    <td className=" py-3 px-4">{city.id}</td>
                                                    <td className=" py-3 px-4">{city.name}</td>
                                                    <div className="text-center h-24 flex items-center justify-center">
                                                        <img
                                                            src={`http://localhost:8000/storage/${city.image}`}
                                                            alt={`city ${city.id} - Image ${i}`}
                                                            className="w-24 text-center "
                                                        />
                                                    </div>
                                                    <td className="gap-5">
                                                        <button
                                                            onClick={() => navigate(`../updateCity/${city.id}`)}
                                                            type=""
                                                            className="p-2 outline-none bg-[#4183ec] text-white rounded-md hover:bg-[#5392f9] mr-2"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(city.id)}
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

export default ListCity;
