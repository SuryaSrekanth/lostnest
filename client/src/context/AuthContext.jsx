import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('lostnest_token') || null);
    const [loading, setLoading] = useState(true);

    // Logout handler (Declareed first so it can be called anywhere)
    const logout = () => {
        localStorage.removeItem('lostnest_token');
        setToken(null);
        setUser(null);
    };

    // Check if token exists on load and fetch user profile
    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await API.get('/auth/me');
                    setUser(res.data);
                }   catch (err) {
                    console.error('Session expired or invalid token');
                    logout();
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, [token]);

    // Login handler
    const login = async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        localStorage.setItem('lostnest_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    // Register handler
    const register = async (userData) => {
        const res = await API.post('/auth/register', userData);
        localStorage.setItem('lostnest_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);