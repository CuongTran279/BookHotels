import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8000/api/auth',
    headers: {
        'Content-type': 'application/json',
    },
});

export const ValidateRegister = (payload, setInvalidfield) => {
    let newErrors = {};
    if (!payload.phone) {
        newErrors.phone = 'Số điện thoại không được để trống.';
    } else if (!payload.phone.match(/^\d+$/)) {
        newErrors.phone = 'Số điện thoại phải có dạng số';
    } else if (!payload.phone.match(/^[0-9]{10}$/)) {
        newErrors.phone = 'Số điện thoại phải có 10 chữ số.';
    } else if (!payload.phone.match(/^0[0-9]{9}$/)) {
        newErrors.phone = 'Số điện thoại phải bắt đầu từ số 0';
    }
    if (!payload.password) {
        newErrors.password = 'Mật khẩu không được để trống.';
    } else if (payload.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }

    if (!payload.repass) {
        newErrors.repass = 'Mật khẩu không được để trống.';
    } else if (payload.repass.length < 6) {
        newErrors.repass = 'Mật khẩu phải có ít nhất 6 ký tự.';
    } else if (payload.password !== payload.repass) {
        newErrors.repass = 'Mật khẩu nhập lại phải giống nhau';
    }
    if (!payload.address) {
        newErrors.address = 'Địa chỉ không được để trống.';
    }
    if (!payload.fullName) {
        newErrors.fullName = 'Họ và tên không được để trống.';
    }
    if (!payload.email) {
        newErrors.email = 'Email không được để trống.';
    } else if (!payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = 'Email không hợp lệ.';
    }
    setInvalidfield(newErrors);
    return Object.keys(newErrors).length === 0;
};

export const ValidateLogin = (payload, setInvalidfield) => {
    let newErrors = {};
    if (!payload.password) {
        newErrors.password = 'Mật khẩu không được để trống.';
    } else if (payload.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    if (!payload.email) {
        newErrors.email = 'Email không được để trống.';
    } else if (!payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = 'Email không hợp lệ.';
    }
    setInvalidfield(newErrors);
    return Object.keys(newErrors).length === 0;
};


export const login = async(formData)=>{
    try {
        const res = await http.post('/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error deleting hotel:', error);
        throw error;
    }
}

export const Register = async(formData)=>{
    try {
        await http.post('/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error deleting hotel:', error);
        throw error;
    }
}

export const viewUser = async()=>{
    try {
        const res = await  http.get('/viewUser');
        return res.data;
    } catch (error) {
        console.error('Error deleting hotel:', error);
        throw error;
    }
}

export const updateUser = async (id,formData) => {
    try {
        await http.post(`/updateUser/${id}`, formData);
    } catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
};
