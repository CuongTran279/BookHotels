import { useEffect } from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import { UpdateStatus,updateDay } from '../../components/data/ApiBillAdmin';
const Home = () => {
    useEffect(() => {
        UpdateStatus();
    }, []);
    useEffect(() => {
        updateDay();
    }, []);
    return (
        <div className="p-0 m-0 grid grid-flow-row h-screen w-screen">
            <header className="h-[60px] z-50">
                <Header />
            </header>
            <div className="w-screen h-full z-10">
                <Outlet />
            </div>
            <footer className="bg-gray-900 h-fit flex flex-col justify-center z-10">
                <div className="text-white text-center my-10">CopryRight @2024 Trần Đình Cường</div>
            </footer>
        </div>
    );
};

export default Home;
