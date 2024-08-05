import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8000/api/city',
    headers: {
        'Content-type': 'application/json',
    },
});

export const Validate = async (payload, setInvalidfield) => {
    let err = {};
    if (!payload.name) err.name = 'Không được để trống';
    setInvalidfield(err);
    return Object.keys(err).length === 0;
};

export const AddCityAdmin = async(formData)=>{
    try {
        await http.post('/admin/addCity', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
}

export const ListCityAdmin = async () => {
    try {
        const response = await http.get('admin/city');
        return response.data;
    } catch (error) {
        console.error('Error fetching city:', error);
        throw error;
    }
};

export const DeleteCityAdmin = async (id) => {
    try {
        await http.delete(`admin/deleteCity/${id}`);
    } catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
};

export const cityById = async (id) => {
    try {
        const response = await http.get(`admin/cityById/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching city by ID:', error);
        throw error;
    }
};

export const UpdateCityAdmin = async (id, formData) => {
    try {
        await http.post(`admin/updateCity/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error update city:', error);
        throw error;
    }
};
