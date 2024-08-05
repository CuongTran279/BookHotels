import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8000/api/dashboard/admin',
    headers: {
        'Content-type': 'application/json',
    },
});

export const getDashboardData = async (type) => {
    try {
        const response = await http.get(`/${type}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        throw error;
    }
};
