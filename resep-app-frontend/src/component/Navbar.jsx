import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { MenuIcon, XIcon, UserIcon, HeartIcon, PlusCircleIcon, LogOutIcon } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

 const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <Link to="/" className="hover:opacity-80 transition-opacity">Resepku</Link>
        </div>

        {/* Menu for Desktop */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/favorites" className="text-white hover:text-orange-300 flex items-center">
            <HeartIcon size={20} className="mr-2" /> Favorit
          </Link>
          <Link to="/recipes" className="text-white hover:text-orange-300 flex items-center">
            <PlusCircleIcon size={20} className="mr-2" /> Tambah Resep
          </Link>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-white hover:text-orange-300 flex items-center"
            >
              <UserIcon size={20} className="mr-2" /> Profile
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                <ul>
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-black hover:bg-gray-200 flex items-center"
                    >
                      <UserIcon size={20} className="mr-2" /> Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-red-500 hover:bg-gray-200 flex items-center"
                    >
                      <LogOutIcon size={20} className="mr-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white hover:text-orange-300"
        >
          {menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Dropdown Menu for Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-orange-500 shadow-lg rounded-lg py-4">
          <Link
            to="/favorites"
            className="block px-6 py-2 text-white hover:bg-orange-600 flex items-center"
            onClick={() => setMenuOpen(false)}
          >
            <HeartIcon size={20} className="mr-2" /> Favorit
          </Link>
          <Link
            to="/recipes"
            className="block px-6 py-2 text-white hover:bg-orange-600 flex items-center"
            onClick={() => setMenuOpen(false)}
          >
            <PlusCircleIcon size={20} className="mr-2" /> Tambah Resep
          </Link>
          <div className="block px-6 py-2 text-white hover:bg-orange-600">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full text-left flex items-center"
            >
              <UserIcon size={20} className="mr-2" /> Profile
            </button>
            {dropdownOpen && (
              <div className="mt-2 bg-white text-black shadow-lg rounded-lg">
                <ul>
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-200 flex items-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      <UserIcon size={20} className="mr-2" /> Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-red-500 hover:bg-gray-200 w-full text-left flex items-center"
                    >
                      <LogOutIcon size={20} className="mr-2" /> Logout
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
