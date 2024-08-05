import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CartSessionManager = () => {
    const location = useLocation();
    const previousLocation = useRef(location.pathname);

    useEffect(() => {
        if (previousLocation.current === '/cart' && location.pathname !== '/cart') {
            sessionStorage.removeItem('cart');
            console.log('Session cleared!');
        }
        previousLocation.current = location.pathname;
    }, [location]);

    return null;
};

export default CartSessionManager;
