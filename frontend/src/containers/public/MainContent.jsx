import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Các components
import { Button, Load } from '../../components';
import FormSearch from './FormSearch';
// Link Slider
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { sliderSettings, PaginationConfig, RangeSlider } from '../../components';
// Link Pagination
import { ListCityAdmin } from '../../components/data/ApiCityAdmin';
import { ListRoomTypeAdmin } from '../../components/data/ApiRoomTypeAdmin';
import { ListHotelAdmin } from '../../components/data/ApiHotelAdmin';
import { filterSearch } from '../../components/data/ApiBillAdmin';

const MainContent = () => {
    const [roomType, setRoomType] = useState([]);
    const [hotel, setHotel] = useState([]);
    const [cities, setCities] = useState([]);
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [filterAdmin, setFilterAdmin] = useState([]);
    const handleOptionChange = (event) => {
        const value = event.target.value;
        setSelectedOptions((prevSelectedOptions) =>
            prevSelectedOptions.includes(value)
                ? prevSelectedOptions.filter((option) => option !== value)
                : [...prevSelectedOptions, value],
        );
    };
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const data = await ListCityAdmin();
                setCities(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const data = await ListRoomTypeAdmin();
                setRoomType(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchRoomTypes();
    }, []);
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await ListHotelAdmin();
                setHotel(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const filter = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('price', value);
        formData.append('options', selectedOptions);
        try {
            const res = await filterSearch(formData);
            setFilterAdmin(res);
        } catch (error) {
            console.log(error);
        }
    };
    console.log(filterAdmin);
    
    if (loading) return <Load />;
    return (
        <div>
            <div
                className="bg-cover bg-center w-full h-[320px]"
                style={{
                    backgroundImage:
                        'url("https://cdn6.agoda.net/images/MVC/default/background_image/illustrations/bg-agoda-homepage.png")',
                }}
            ></div>
            <div className="w-1124 m-auto h-full flex justify-center flex-row">
                <FormSearch />
            </div>
            <div className="mt-20 w-1124 m-auto h-full flex justify-center flex-col">
                {cities.length > 0 ? (
                    <div className="flex flex-col justify-center items-center gap-20 mb-5">
                        <div>
                            <p className="uppercase font-mono text-3xl">Các địa danh</p>
                        </div>
                        <div className="w-[80%] text-center">
                            <Slider {...sliderSettings}>
                                {cities.map((city, index) => (
                                    <Link to={`/city/${city.id}`}>
                                        <div className="px-10 cursor-pointer" key={index}>
                                            <img
                                                src={`http://localhost:8000/storage/${city.image}`}
                                                style={{ width: '100%', height: '150px' }}
                                                alt={city.name}
                                            />
                                            <h3 className="italic uppercase mt-2">{city.name}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </Slider>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center gap-20 mb-5">
                        <div>
                            <p className="uppercase font-mono text-3xl">Các địa danh</p>
                        </div>
                        <div className="w-[80%] text-center">
                            <h3 className="italic uppercase mt-2">Chưa có bản ghi nào</h3>
                        </div>
                    </div>
                )}
                <div className="flex flex-col justify-center items-center gap-20 mb-5 mt-5">
                    <div>
                        <p className="uppercase font-mono text-3xl">Các khách sạn</p>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-20 mb-5 ml-0">
                        <div className="border p-5 w-4/12 sticky">
                            <form action="" onSubmit={filter}>
                                <div className="mb-5">
                                    <p className="mb-5 text-xl text-gray-600">Giá mỗi đêm </p>
                                    <RangeSlider value={value} setValue={setValue} />
                                </div>
                                <div className="mb-5">
                                    <p className="mb-5 text-xl text-gray-600">Các loại phòng </p>
                                    {roomType.map((room, i) => (
                                        <label key={i} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                value={room.id}
                                                onChange={handleOptionChange}
                                                checked={selectedOptions.includes(room.id.toString())}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">{room.name}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="mb-5">
                                    <button
                                        className="text-[#5392f9] outline-[#5392f9] hover:bg-[#5392f9] hover:text-white ease-in duration-300 outline rounded-sm p-2 outline-1 "
                                        onClick={filter}
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="flex flex-col gap-5 mb-5 ml-0 w-8/12 pl-5">
                            {filterAdmin.length !== 0 ? (
                                <PaginationConfig hotel={filterAdmin} />
                            ) : (
                                <PaginationConfig hotel={hotel} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainContent;
