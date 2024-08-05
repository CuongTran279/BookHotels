import React, { useEffect, useState } from 'react';
import { ViewBillByUserId, commentAdmin } from '../../components/data/ApiBillAdmin';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Load } from '../../components';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const Profile = () => {
    const storedData = localStorage.getItem('user');
    const user = JSON.parse(storedData);
    const [loading, setLoading] = useState(true);
    const [bill, setBill] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [com, setCom] = useState('');
    const [current, setCurrent] = useState({
        hotelId: '',
        billId: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await ViewBillByUserId(user.id);
                setBill(res);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching room type:', error);
            }
        };
        fetchCart();
    }, [user.id]);

    const cmt = (hotelId, billId) => {
        setCurrent({
            hotelId: hotelId,
            billId: billId,
        });
        setIsOpen(!isOpen);
    };

    const comment = async () => {
        console.log({ comment: com, hotelId: current.hotelId, userId: user.id, billId: current.billId });
        const formData = new FormData();
        formData.append('comment', com);
        formData.append('hotelId', current.hotelId);
        formData.append('billId', current.billId);
        formData.append('userId', user.id);
        try {
            await commentAdmin(formData);
            await Swal.fire({
                title: 'Thêm mới thành công',
                icon: 'success',
            });
            window.location.reload();
        } catch (err) {
            Swal.fire({
                title: 'Đã có lỗi xảy ra',
                text: err.message,
                icon: 'error',
            });
        }
    };

    if (loading) return <Load />;

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto py-8">
                <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                    <div className="col-span-4 sm:col-span-3">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex flex-col items-center">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Qyi8tRpVjnQd4z_OEJgWuEyEBqX33bjKrdagthSYdwTR3xt3y3zFyQ8_PZjJkxrza4M&usqp=CAU"
                                    className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                                    alt="User"
                                />
                                <h1 className="text-xl font-bold">{user.fullName}</h1>
                                <p className="text-gray-700">{user.email}</p>
                                <p className="text-gray-700">{user.phone}</p>
                            </div>
                            <hr className="my-6 border-t border-gray-300" />
                        </div>
                    </div>
                    <div className="col-span-4 sm:col-span-9">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Lịch sử đơn hàng</h2>
                            <div className="text-gray-700">
                                {bill.map((hotel, i) => (
                                    <div
                                        key={i}
                                        className="rounded-xl drop-shadow-xl bg-white px-5 py-5 flex gap-10 mb-5"
                                    >
                                        <div>
                                            <img
                                                src={`http://localhost:8000/storage/${hotel.image}`}
                                                alt=""
                                                className="w-[200px] h-[200px]"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <p className="text-gray-700 font-bold">{hotel.name}</p>
                                            <p className="text-gray-700">
                                                {hotel.address} - {hotel.city}
                                            </p>
                                            <p>{hotel.phone}</p>
                                            <hr />
                                            <div className="flex flex-row justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-700 font-semibold mb-5">
                                                        {hotel.roomTypeName}
                                                    </span>
                                                    <span className="text-gray-700">
                                                        Khách : {hotel.capacity} người
                                                    </span>
                                                    <span className="text-gray-700">
                                                        Số lượng phòng : {hotel.quantity}
                                                    </span>
                                                    <span className="text-gray-700">Check In : {hotel.getIn}</span>
                                                    <span>Check Out : {hotel.getOut}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="flex">
                                                        <p className="text-gray-700 font-semibold">Tổng số tiền :</p>
                                                        {Number(hotel.total).toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        })}
                                                    </span>
                                                    <p>
                                                        <td>
                                                            <p className="text-red-500 font-bold">
                                                                {hotel.status === 0 && 'Chưa CheckIn'}
                                                            </p>
                                                            <p className="text-green-500 font-bold">
                                                                {hotel.status === 1 && 'Đã CheckIn'}
                                                            </p>
                                                            <p className="text-blue-500 font-bold">
                                                                {hotel.status === 2 && 'Đánh giá'}
                                                            </p>
                                                            <p className="text-amber-500 font-bold">
                                                                {hotel.status === 3 && 'Đã hoàn thành'}
                                                            </p>
                                                        </td>
                                                    </p>
                                                    {hotel.status === 2 && (
                                                        <button
                                                            onClick={() => cmt(hotel.id, hotel.billId)}
                                                            className="text-[#5392f9] outline-[#5392f9] hover:bg-[#5392f9] hover:text-white ease-in duration-300 outline rounded-sm p-2 outline-1 mt-5"
                                                        >
                                                            Đánh giá
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isOpen && (
                                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <h2 className="text-xl font-semibold mb-4">Bình luận</h2>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                config={{
                                                    toolbar: [
                                                        'heading',
                                                        '|',
                                                        'bold',
                                                        'italic',
                                                        'link',
                                                        'bulletedList',
                                                        'numberedList',
                                                        'blockQuote',
                                                    ],
                                                }}
                                                name="comment"
                                                data={com}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    setCom(data);
                                                }}
                                            />
                                            <button
                                                onClick={comment}
                                                className="text-[#5392f9] outline-[#5392f9] hover:bg-[#5392f9] hover:text-white ease-in duration-300 outline rounded-sm p-2 outline-1 mt-5"
                                            >
                                                Bình luận
                                            </button>
                                            <button
                                                className="bg-red-500 text-white p-2 rounded mt-5 ml-5"
                                                onClick={cmt}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
