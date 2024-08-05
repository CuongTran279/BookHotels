import React, { useState } from 'react';
import { Button, InputForm } from '../../components';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ValidateLogin,login } from '../../components/data/ApiAuth';
const Register = () => {
    const [payload, setPayload] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const [invalidfield, setInvalidfield] = useState([]);
    const handleSubmit1 = async (e) => {
        e.preventDefault();
        if (!ValidateLogin(payload, setInvalidfield)) return;
        try{
            const res = await login(payload);
            const {password,...user} = res
            localStorage.setItem('user',JSON.stringify(user))
            await Swal.fire({
                title: 'Bạn đã đăng nhập thành công',
                icon: 'success',
            });
            navigate('/');
            window.location.reload(); 
        }catch(err){
            if (err.response && err.response.status === 401) {
                Swal.fire({
                    title: 'Tài khoản không tồn tại',
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
                        <h1 className="font-semibold text-2xl">Đăng nhập</h1>
                    </div>
                        <InputForm
                            setInvalidfield={setInvalidfield}
                            text="Email"
                            type={'email'}
                            dropShadow="focus:drop-shadow-blue"
                            value={payload.email}
                            setValue={setPayload}
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
                        <div className="mt-5 flex flex-col">
                            <Button
                                text="Đăng nhập"
                                type="submit"
                                textColor="text-[#5392f9]"
                                outline="outline-[#5392f9]"
                                hoverBg="hover:bg-[#5392f9]"
                                hoverText="hover:text-white"
                                onClick={handleSubmit1}
                            />
                        </div>
                    <div className="mt-5 flex flex-row justify-between">
                        <p className="text-[#5392f9] ease-in-out duration-100 hover:text-[#e12d2d] cursor-pointer">
                            <Link to="/login">
                                <span>Đăng ký</span>
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

export default Register;
