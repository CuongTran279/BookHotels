import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8000/api/roomType',
    headers: {
        'Content-type': 'application/json',
    },
});

export const ListRoomTypeAdmin = async () => {
    try {
        const response = await http.get('admin/roomType');
        return response.data;
    } catch (error) {
        console.error('Error fetching room types:', error);
        throw error;
    }
};

export const roomTypeById = async (id) => {
    try {
        const response = await http.get(`admin/roomTypeById/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching room type by ID:', error);
        throw error;
    }
};
export const DeleteRoomTypeAdmin = async (id) => {
    try {
        await http.delete(`admin/deleteRoomType/${id}`);
    } catch (error) {
        console.error('Error deleting room type:', error);
        throw error;
    }
};

export const Validate = async (payload, setInvalidfield) => {
    let err = {};
    if (!payload.name) err.name = 'Không được để trống';
    if (!payload.description) err.description = 'Không được để trống';
    if (!payload.price) {
        err.price = 'Không được để trống';
    } else if (!/^\d+$/.test(payload.price.replace(/₫|\./g, ''))) {
        err.price = 'Giá phải là dạng số';
    }
    if (!payload.capacity) {
        err.capacity = 'Không được để trống';
    } else if (!/^\d+$/.test(payload.capacity)) {
        err.capacity = 'Số lượng người phải là dạng số';
    } else if (parseInt(payload.capacity) > 9) {
        err.capacity = 'Một phòng chứa tối đa 9 người';
    }
    setInvalidfield(err);
    return Object.keys(err).length === 0;
};

export const AddRoomTypeAdmin = async (formData) => {
    try {
        await http.post('/admin/addRoomType', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error deleting room type:', error);
        throw error;
    }
};

export const UpdateRoomTypeAdmin = async (id, formData) => {
    try {
        await http.post(`admin/updateRoomType/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error update room type:', error);
        throw error;
    }
};
