import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('Checking token in localStorage:', token); // Log token dari localStorage

      if (token) {
        try {
          console.log('Sending token to backend for verification...'); // Log request

          const response = await axios.post(
            'http://localhost:5000/auth/verify-token', // Gantilah dengan URL backend yang benar
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log('Response from backend:', response.data); // Log response dari backend

          if (response.status === 200) {
            setAuth(true); // Jika token valid
            setUser(response.data.user); // Menyimpan data pengguna
          }
        } catch (err) {
          console.error('Error verifying token:', err.response || err); // Log error jika verifikasi gagal
          localStorage.removeItem('token');
          setAuth(false); // Logout jika token tidak valid
          setUser(null);
        }
      } else {
        console.log('No token found in localStorage'); // Log jika token tidak ditemukan
        setAuth(false);
        setUser(null);
      }
      setLoading(false); // Selesaikan loading setelah pengecekan
    };

    checkAuth();
  }, []);

  const login = (token) => {
    console.log('Logging in with token:', token); // Log token saat login
    localStorage.setItem('token', token);
    setAuth(true);
  };

  const logout = () => {
    console.log('Logging out, removing token'); // Log saat logout
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ auth, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
