import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import Menu from './pages/MenuUtama';
import Profile from './pages/Profile';
import PrivateRoute from './PrivateRoute'; // Komponen rute yang dilindungi
import { AuthProvider } from './AuthContext'; // Koneksi ke konteks autentikasi
import './index.css'; // Pastikan file CSS benar

const App = () => {
  return (
    <AuthProvider>
      {/* Membungkus aplikasi dengan AuthProvider */}
      <Router>
        {/* Membungkus aplikasi dengan Router */}
        <Routes>
          {/* Halaman yang dapat diakses oleh semua orang */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Halaman yang dilindungi */}
          <Route
            path="/recipes"
            element={<PrivateRoute element={<Recipes />} />}
          />
          <Route
            path="/menu"
            element={<PrivateRoute element={<Menu />} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
