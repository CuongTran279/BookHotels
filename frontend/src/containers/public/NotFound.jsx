import React from 'react';

const NotFound = () => {
    return (
        <div className="h-max">
            <div className="w-1124 m-auto flex flex-row mt-5 p-10">
                <div className=' flex flex-col justify-center'>
                    <p className='text-9xl text-center w-fit'>404</p>
                    <p className='mt-10 text-4xl'>Không tìm thấy địa chỉ bạn muốn tìm</p> 
                </div>
                <div className='ml-10'>
                    <img src="https://cdn.pixabay.com/photo/2015/06/09/16/12/error-803716_640.png" alt='Not-Found_img'/>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
