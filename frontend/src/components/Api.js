import axios from 'axios';
import { useState } from 'react';

export default function Api() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        return JSON.parse(tokenString);
    };

    const getUser = () => {
        const userString = localStorage.getItem('user');
        return JSON.parse(userString);
    };

    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());

    const saveToken = (user, token) => {
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.clear();
    };

    const http = axios.create({
        baseURL: 'http://localhost:8000/api',
        headers: {
            'Content-type': 'application/json',
        },
    });

    // Add a request interceptor
    http.interceptors.request.use(
        function (config) {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        function (error) {
            return Promise.reject(error);
        },
    );

    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        http,
        logout,
        getUser,
    };
}
