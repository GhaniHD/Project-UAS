import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // Mengelola status dropdown
  const [menuOpen, setMenuOpen] = useState(false); // Untuk menu mobile
  const { logout } = useAuth(); // Menggunakan logout dari AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-orange-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <h1>Resepku</h1>
        </div>

        {/* Menu untuk Desktop */}
        <div className="hidden md:flex space-x-10 items-center ml-auto">
          <Link className="text-white font-semibold hover:text-orange-300" to="/favorites">
            Favorit
          </Link>
          <Link className="text-white font-semibold hover:text-orange-300" to="/recipes">
            Tambah Recipe
          </Link>
          <div className="relative">
            <button
              className="text-white font-semibold hover:text-orange-300"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Profile
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg z-10">
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
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Menu untuk Mobile */}
        <button
          className="md:hidden text-white hover:text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Menu Dropdown untuk Mobile */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-2 bg-orange-500 text-white p-4 rounded-lg shadow-lg">
          <Link
            className="block hover:text-gray-300"
            to="/favorites"
            onClick={() => setMenuOpen(false)}
          >
            Favorit
          </Link>
          <Link
            className="block hover:text-gray-300"
            to="/recipes"
            onClick={() => setMenuOpen(false)}
          >
            Tambah Recipe
          </Link>
          <div>
            <button
              className="block w-full text-left hover:text-gray-300"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Profile
            </button>
            {dropdownOpen && (
              <div className="mt-2 bg-white text-black shadow-lg rounded-lg">
                <ul>
                  <li>
                    <Link
                      className="block px-4 py-2 hover:bg-gray-200"
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="block px-4 py-2 text-red-500 hover:bg-gray-200 w-full text-left"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
