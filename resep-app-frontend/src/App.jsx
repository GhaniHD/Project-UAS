import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Recipes from './pages/recipes/Recipes';
import Menu from './pages/recipes/MenuUtama';
import Profile from './pages/user/Profile';
import Favorit from './pages/user/Favorit';
import PrivateRoute from '../src/routes/PrivateRoute'; // Komponen rute yang dilindungi
import { AuthProvider } from './contexts/AuthContext'; // Koneksi ke konteks autentikasi
import '../src/style/index.css'; // Pastikan file CSS benar

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
            <Route
          path="/favorit"
            element={<PrivateRoute element={<Favorit />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
