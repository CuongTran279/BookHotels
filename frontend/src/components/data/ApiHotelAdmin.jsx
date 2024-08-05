import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8000/api/hotel',
    headers: {
        'Content-type': 'application/json',
    },
});

export const Validate = async (payload, setInvalidfield) => {
    let err = {};
    if (!payload.name) err.name = 'Không được để trống';
    if (!payload.description) err.description = 'Không được để trống';
    if (!payload.address) err.address = 'Không được để trống';
    if (!payload.city) err.city = 'Không được để trống';
    if (!payload.phone) {
        err.phone = 'Số điện thoại không được để trống.';
    } else if (!payload.phone.match(/^\d+$/)) {
        err.phone = 'Số điện thoại phải có dạng số';
    } else if (!payload.phone.match(/^[0-9]{10}$/)) {
        err.phone = 'Số điện thoại phải có 10 chữ số.';
    } else if (!payload.phone.match(/^0[0-9]{9}$/)) {
        err.phone = 'Số điện thoại phải bắt đầu từ số 0';
    }
    setInvalidfield(err);
    return Object.keys(err).length === 0;
};

export const AddHotelAdmin = async (formData) => {
    try {
        await http.post('/admin/addHotel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error deleting hotel:', error);
        throw error;
    }
};

export const ListHotelAdmin = async (setPayload) => {
    try {
        const response = await http.get('admin/hotel');
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
                count,
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
                quantity: count,
                status: status,
                images: roomTypeImage.split('|'),
            });
        });
        return Array.from(hotelMap.values());
        // return response
    } catch (error) {
        console.error('Error fetching hotel:', error);
        throw error;
    }
};

export const DeleteHotelAdmin = async (id) => {
    try {
        await http.delete(`admin/deleteHotel/${id}`);
    } catch (error) {
        console.error('Error deleting hotel:', error);
        throw error;
    }
};

export const hotelById = async (idHotel) => {
    try {
        const response = await http.get(`admin/hotelById/${idHotel}`);
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
                count,
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
                quantity: count,
                status: status,
                images: roomTypeImage ? roomTypeImage.split('|') : [], // Kiểm tra trước khi gọi split
            });
        });
        return Array.from(hotelMap.values());
    } catch (error) {
        console.error('Error fetching hotel by Id:', error);
        throw error;
    }
};

export const hotelByCity = async (id) => {
    try {
        const response = await http.get(`admin/hotelByCity/${id}`);
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
                count,
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
                quantity: count,
                status: status,
                images: roomTypeImage.split('|'),
            });
        });
        return Array.from(hotelMap.values());
    } catch (error) {
        console.error('Error fetching hotel:', error);
        throw error;
    }
};

export const viewHotelByCity = async (id) => {
    try {
        const response = await http.get(`admin/viewHotelByCity/${id}`);
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
                count,
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
                quantity: count,
                status: status,
                images: roomTypeImage.split('|'),
            });
        });
        return Array.from(hotelMap.values());
    } catch (error) {
        console.error('Error fetching hotel:', error);
        throw error;
    }
};

export const UpdateHotelAdmin = async (id, formData) => {
    try {
        await http.post(`admin/updateHotel/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error update room type:', error);
        throw error;
    }
};
