import React, { useEffect, useState } from 'react';
import { viewHotelByCity } from '../../components/data/ApiHotelAdmin';
import { cityById } from '../../components/data/ApiCityAdmin';
import { Load } from '../../components';
import { useParams } from 'react-router-dom';
import { PaginationConfig } from '../../components';
const City = () => {
    const [payload, setPayload] = useState([]);
    const [city, setCity] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    useEffect(() => {
        const fetchHotel = async () => {
            const response = await viewHotelByCity(id);
            setPayload(response);
            setLoading(false);
        };
        fetchHotel();
    }, []);
    useEffect(() => {
        const fetchCity = async () => {
            const response = await cityById(id);
            setCity(response);
            setLoading(false);
        };
        fetchCity();
    }, []);
    if (loading) return <Load />;
    return (
        <div>
            <div
                className="bg-cover bg-center w-full h-[520px] flex justify-center items-center relative"
                style={{
                    backgroundImage: `url('http://localhost:8000/storage/${city.image}')`,
                }}
            >
                <div className="overlay absolute inset-0 bg-black opacity-50"></div>
                <p className="font-serif uppercase text-6xl text-white relative z-10">{city.name}</p>
            </div>
            <div className='flex justify-center mt-5'>
                <PaginationConfig hotel={payload}/>
            </div>
        </div>
    );
};

export default City;
