import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home, Login, MainContent, Register, NotFound, Cart, Detail, City, Profile } from './containers/public';
import {
    LayoutAdmin,
    MainContentAdmin,
    ListRoomType,
    AddRoomType,
    UpdateRoomType,
    AddHotel,
    UpdateHotel,
    ListHotel,
    ListCity,
    AddCity,
    UpdateCity,
    ListBill,
    ListUser
} from './containers/admin';
import { CartSessionManager } from './components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
function ProtectedRoute({ children, allowedRole }) {
    const storedData = localStorage.getItem('user');
    const user = JSON.parse(storedData);
    if (!user) {
        return <Navigate to="/register" />;
    } else if (user.role !== allowedRole) {
        return <Navigate to="/not-found" />;
    }
    return children;
}
function CartProtectedRoute({ children }) {
    const cartData = sessionStorage.getItem('cart');
    const cart = JSON.parse(cartData);
    if (!cart) {
        return <Navigate to="/notfound" />;
    }
    return children;
}
function ProfileProtected({ children }) {
    const storedData = localStorage.getItem('user');
    const user = JSON.parse(storedData);
    if (!user) {
        return <Navigate to="/notfound" />;
    }
    return children;
}
function App() {
    return (
        <div className="h-screen bg-primary">
            <Router>
                <CartSessionManager />
                <Routes>
                    <Route path="/" element={<Home />}>
                        <Route index element={<MainContent />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/notfound" element={<NotFound />} />
                        <Route
                            path="/profile"
                            element={
                                <ProfileProtected>
                                    <Profile />
                                </ProfileProtected>
                            }
                        />
                        <Route
                            path="/cart"
                            element={
                                <CartProtectedRoute>
                                    <Cart />
                                </CartProtectedRoute>
                            }
                        />
                        <Route path="/detail/:id" element={<Detail />} />
                        <Route path="/city/:id" element={<City />} />
                        <Route path="*" element={<Navigate to="/notfound" />} />
                    </Route>
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRole={1}>
                                <LayoutAdmin />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<MainContentAdmin />} />
                        <Route path="addRoomType" element={<AddRoomType />} />
                        <Route path="roomType" element={<ListRoomType />} />
                        <Route path="updateRoomType/:id" element={<UpdateRoomType />} />
                        <Route path="addHotel" element={<AddHotel />} />
                        <Route path="hotel" element={<ListHotel />} />
                        <Route path="updateHotel/:id" element={<UpdateHotel />} />
                        <Route path="addCity" element={<AddCity />} />
                        <Route path="city" element={<ListCity />} />
                        <Route path="updateCity/:id" element={<UpdateCity />} />
                        <Route path="bill" element={<ListBill />} />
                        <Route path="user" element={<ListUser />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
