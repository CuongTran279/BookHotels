import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoPeople } from 'react-icons/io5';
import { FaMoneyBillTrendUp, FaHouseChimneyWindow } from 'react-icons/fa6';
import { PiCityBold } from 'react-icons/pi';
import { getDashboardData } from '../../components/data/ApiDashBoard';
import { Load } from '../../components';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
const MainContentAdmin = () => {
    // const [roomQuantity, setRoomQuantity] = useState(null);
    // const [sumPrice, setSumPrice] = useState(null);
    // const [userQuantity, setUserQuantity] = useState(null);
    // const [sumHotel, setSumHotel] = useState(null);
    // const [hotelByCity, setHotelByCity] = useState(null);
    const [payload, setPayload] = useState({
        roomQuantity: '',
        sumPrice: '',
        userQuantity: '',
        sumHotel: '',
        hotelByCity: [],
        roomsByHotel: [],
        hotelByViews: [],
        hotelBuyMost: [],
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const roomQuantityData = await getDashboardData('roomQuantity');
                const sumPriceData = await getDashboardData('sumPrice');
                const userQuantityData = await getDashboardData('userQuantity');
                const sumHotelData = await getDashboardData('sumHotel');
                const hotelByCityData = await getDashboardData('hotelByCity');
                const roomByHotelData = await getDashboardData('roomsByHotel');
                const hotelByViewsData = await getDashboardData('hotelByViews');
                const hotelBuyMostData = await getDashboardData('hotelBuyMost');
                setPayload({
                    roomQuantity: roomQuantityData.roomSum,
                    sumPrice: sumPriceData.total,
                    userQuantity: userQuantityData.user,
                    sumHotel: sumHotelData.hotels,
                    hotelByCity: hotelByCityData,
                    roomsByHotel: roomByHotelData,
                    hotelByViews: hotelByViewsData,
                    hotelBuyMost : hotelBuyMostData,
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Load />;
    return (
        <div>
            <div className="w-full border-t flex flex-col">
                <main className="w-full flex-grow p-6">
                    <h1 className="text-3xl text-black pb-6">Dashboard</h1>
                </main>
                <div class="flex mt-6 justify-around">
                    <div className="flex flex-col w-60 p-4 bg-white rounded-xl drop-shadow-xl list-none">
                        <li className="p-2 cursor-pointer">
                            <IoPeople style={{ color: '#5392f9', fontSize: '60px' }} />
                        </li>
                        <li className="p-2 cursor-pointer">Người dùng : {payload.userQuantity}</li>
                    </div>
                    <div className="flex flex-col w-60 p-4 bg-white rounded-xl drop-shadow-xl list-none">
                        <li className="p-2 cursor-pointer">
                            <FaMoneyBillTrendUp style={{ color: '#ff567d', fontSize: '60px' }} />
                        </li>
                        <li className="p-2 cursor-pointer">
                            Tổng số tiền :{' '}
                            {Number(payload.sumPrice).toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </li>
                    </div>
                    <div className="flex flex-col w-60 p-4 bg-white rounded-xl drop-shadow-xl list-none">
                        <li className="p-2 cursor-pointer">
                            <FaHouseChimneyWindow style={{ color: 'green', fontSize: '60px' }} />
                        </li>
                        <li className="p-2 cursor-pointer">Tổng số phòng : {payload.roomQuantity}</li>
                    </div>
                    <div className="flex flex-col w-60 p-4 bg-white rounded-xl drop-shadow-xl list-none">
                        <li className="p-2 cursor-pointer">
                            <PiCityBold style={{ color: 'purple', fontSize: '60px' }} />
                        </li>
                        <li className="p-2 cursor-pointer">Tổng các khách sạn : {payload.sumHotel}</li>
                    </div>
                </div>
                <div class="flex mt-6 justify-between p-5">
                    <div>
                        <h2>Hotels by City</h2>
                        <BarChart width={750} height={400} data={payload.hotelByCity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="city" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="hotel" fill="#8884d8" />
                        </BarChart>
                    </div>
                    <div>
                        <h2>Count rooms by Hotel</h2>
                        <BarChart width={750} height={400} data={payload.roomsByHotel}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="rooms" fill="#8884d8" />
                        </BarChart>
                    </div>
                </div>
                <div class="flex mt-6 justify-between p-5">
                    <div>
                        <h2>Hotels by Views</h2>
                        <BarChart
                            width={750}
                            height={400}
                            data={payload.hotelByViews}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="views" fill="#8884d8" />
                        </BarChart>
                    </div>
                    <div>
                        <h2>Hotels book Most</h2>
                        <BarChart
                            width={750}
                            height={400}
                            data={payload.hotelBuyMost}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quantity" fill="#8884d8" />
                        </BarChart>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainContentAdmin;
