import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8000/api/bill',
    headers: {
        'Content-type': 'application/json',
    },
});

export const Validate = (date) => {
    const now = new Date();
    const getIn = new Date(date.getIn);
    const getOut = new Date(date.getOut);
    if (!date.getIn || !date.getOut || !date.people || !date.quantity || !date.search)
        return 'Vui lòng chọn hết các dữ liệu';
    if (getIn < now) {
        return 'Không được chọn ngày quá khứ';
    } else if (getOut <= getIn) {
        return 'Ngày đi không được nhỏ hơn hoặc cùng ngày đến';
    } else if (date.people < date.quantity) {
        return 'Số lượng người không được nhỏ hơn số phòng';
    }
    return '';
};

export const ValidateMain = (date) => {
    const now = new Date();
    const getIn = new Date(date.getIn);
    const getOut = new Date(date.getOut);
    if (!date.getIn || !date.getOut || !date.people || !date.quantity) return 'Vui lòng chọn hết các dữ liệu';
    if (getIn < now.toLocaleDateString()) {
        return 'Không được chọn ngày quá khứ';
    } else if (getOut <= getIn) {
        return 'Ngày đi không được nhỏ hơn hoặc cùng ngày đến';
    } else if (date.people < date.quantity) {
        return 'Số lượng người không được nhỏ hơn số phòng';
    }
    return '';
};

export const SearchRoom = async (id, formData) => {
    try {
        const response = await http.post(`admin/searchRoom/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching city:', error);
        throw error;
    }
};

export const Price = async () => {
    try {
        const response = await http.get('admin/price');
        return response.data;
    } catch (error) {
        console.error('Error fetching city:', error);
        throw error;
    }
};

export const ViewBillByUserId = async (id) => {
    try {
        const response = await http.get(`admin/viewBillByUserId/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching city:', error);
        throw error;
    }
};

export const ViewBill = async (id) => {
    try {
        const response = await http.get(`admin/viewBill`);
        return response.data;
    } catch (error) {
        console.error('Error fetching city:', error);
        throw error;
    }
};
export const UpdateStatus = async () => {
    try {
        await http.get('admin/updateStatus');
    } catch (error) {
        console.error('Error fetching city:', error);
        throw error;
    }
};

export const updateDay = async () => {
    try {
        await http.get('admin/updateDay');
    } catch (error) {
        console.error('Error fetching city:', error);
        throw error;
    }
};

export const searchMainRoom = async (formData) => {
    try {
        const response = await http.post(`admin/searchMainRoom`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const hotelMap = new Map();
        response.data.forEach((hotel) => {
            const {
                id,
                name,
                image,
                address,
                city,
                phone,
                description,
                status,
                roomTypeName,
                roomTypeDescription,
                roomTypePrice,
                roomTypeCapacity,
                roomTypeImage,
                quantity,
                roomTypeId,
            } = hotel;

            if (!hotelMap.has(id)) {
                hotelMap.set(id, {
                    id,
                    name,
                    image,
                    address,
                    city,
                    phone,
                    description,
                    rooms: [],
                });
            }

            const hotelfetch = hotelMap.get(id);
            hotelfetch.rooms.push({
                room_type_id: roomTypeId,
                name: roomTypeName,
                description: roomTypeDescription,
                price: roomTypePrice,
                capacity: roomTypeCapacity,
                count: quantity,
                status: status,
                images: roomTypeImage.split('|'),
            });
        });
        return Array.from(hotelMap.values());
    } catch (error) {
        console.error('Error fetching city:', error);
        throw error;
    }
};

export const addCart = async (formData) => {
    try {
        const response = await http.post(`admin/addCart`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error fetching city:', error);
        throw error;
    }
};

export const viewCart = async (id) => {
    try {
        const response = await http.get(`admin/viewCart/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching city:', error);
        throw error;
    }
};

export const deleteAdminCart = async (formData) => {
    try {
        await http.post(`admin/deleteCart`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
};

export const bookAdminHotel = async (formData) => {
    try {
        const response = await http.post(`admin/bookHotel`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
};

export const updateBill = async (id,formData) => {
    try {
        await http.post(`admin/updateBill/${id}`, formData);
    } catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
};

export const commentAdmin = async (formData) => {
    try {
        await http.post(`admin/comment`, formData);
    } catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
};

export const commentByHotel = async (id) => {
    try {
        const res = await http.get(`admin/commentByHotel/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
};

export const filterSearch = async (formData) => {
    try {
        const res = await http.post(`admin/filter`,formData);
        return res.data;
    } catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
};
