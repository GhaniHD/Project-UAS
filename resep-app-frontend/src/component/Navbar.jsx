import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Mengimpor context auth untuk akses logout

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // Mengelola status dropdown
  const { logout } = useAuth(); // Menggunakan logout dari AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Memanggil fungsi logout dari AuthContext
    navigate('/login'); // Mengarahkan pengguna ke halaman login
  };

  return (
    <nav className="bg-orange-600 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-2xl">
          <h1>Resepku</h1>
        </div>
        <div className="relative">
          <ul className="flex space-x-4">
            <li>
              <Link className="text-white hover:text-gray-400" to="/favorites">Favorit</Link>
            </li>
            <li>
              <Link className="text-white hover:text-gray-400" to="/recipes">Tambah Recipe</Link>
            </li>
            <li className="relative">
              <button 
                className="text-white hover:text-gray-400"
                onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
              >
                Profile
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg">
                  <ul>
                    <li>
                      <Link 
                        className="block px-4 py-2 hover:bg-gray-200"
                        to="/profile"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="block px-4 py-2 text-red-500 hover:bg-gray-200 w-full text-left"
                        onClick={handleLogout} // Logout on click
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
