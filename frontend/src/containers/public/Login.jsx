import React, { useState } from 'react';
import { InputForm } from '../../components';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ValidateRegister,Register } from '../../components/data/ApiAuth';
const Login = () => {
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        phone: '',
        address: '',
        fullName: '',
        repass: '',
    });
    const navigate = useNavigate();
    const [invalidfield, setInvalidfield] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ValidateRegister(payload, setInvalidfield)) return;
        const { repass, ...payloadRegister } = payload;
        try {
            await Register(payloadRegister);
            await Swal.fire({
                title: 'Bạn đã đăng ký thành công',
                icon: 'success',
            });
            navigate('/register');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                Swal.fire({
                    title: 'Tài khoản đã tồn tại',
                    text: err.message,
                    icon: 'error',
                });
            } else {
                Swal.fire({
                    title: 'Đã có lỗi xảy ra',
                    text: err.message,
                    icon: 'error',
                });
            }
        }
    };
    return (
        <div className="h-full">
            <div className="w-1124 m-auto flex justify-center flex-row">
                <div className="mt-[30px] w-[500px] bg-white drop-shadow-xl py-10 px-5 font-sans">
                    <div>
                        <h1 className="font-semibold text-2xl">Đăng ký</h1>
                    </div>
                    <InputForm
                        setInvalidfield={setInvalidfield}
                        text="Email"
                        dropShadow="focus:drop-shadow-blue"
                        value={payload.email}
                        setValue={setPayload}
                        type={'email'}
                    />
                    {invalidfield.email && <p style={{ color: 'red' }}>{invalidfield.email}</p>}
                    <InputForm
                        setInvalidfield={setInvalidfield}
                        text="Mật khẩu"
                        type={'password'}
                        dropShadow="focus:drop-shadow-blue"
                        value={payload.password}
                        setValue={setPayload}
                    />
                    {invalidfield.password && <p style={{ color: 'red' }}>{invalidfield.password}</p>}
                    <InputForm
                        setInvalidfield={setInvalidfield}
                        text="Nhập lại mật khẩu"
                        type={'repass'}
                        dropShadow="focus:drop-shadow-blue"
                        value={payload.repass}
                        setValue={setPayload}
                    />
                    {invalidfield.repass && <p style={{ color: 'red' }}>{invalidfield.repass}</p>}
                    <InputForm
                        setInvalidfield={setInvalidfield}
                        text="Địa chỉ"
                        dropShadow="focus:drop-shadow-blue"
                        value={payload.address}
                        setValue={setPayload}
                        type={'address'}
                    />
                    {invalidfield.address && <p style={{ color: 'red' }}>{invalidfield.address}</p>}
                    <InputForm
                        setInvalidfield={setInvalidfield}
                        text="SĐT"
                        dropShadow="focus:drop-shadow-blue"
                        value={payload.phone}
                        setValue={setPayload}
                        type={'phone'}
                    />
                    {invalidfield.phone && <p style={{ color: 'red' }}>{invalidfield.phone}</p>}
                    <InputForm
                        setInvalidfield={setInvalidfield}
                        text="Họ và tên"
                        dropShadow="focus:drop-shadow-blue"
                        value={payload.fullName}
                        setValue={setPayload}
                        type={'fullName'}
                    />
                    {invalidfield.fullName && <p style={{ color: 'red' }}>{invalidfield.fullName}</p>}
                    <div className="mt-5 flex flex-col">
                        <button
                            className="text-[#5392f9] outline-[#5392f9] hover:bg-[#5392f9] hover:text-white ease-in duration-300 outline rounded-sm p-2 outline-1 mt-5"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Đăng ký
                        </button>
                    </div>
                    <div className="mt-5 flex flex-row justify-between">
                        <p className="text-[#5392f9] ease-in-out duration-100 hover:text-[#e12d2d] cursor-pointer">
                            <Link to="/register">
                                <span>Đăng nhập</span>
                            </Link>
                        </p>
                        <p className="text-[#5392f9] ease-in-out duration-100 hover:text-[#e12d2d] cursor-pointer">
                            Quên mật khẩu
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
