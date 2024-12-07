import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-orange-600 p-4">
            <div className="flex justify-between items-center">
                <div className="text-white text-2xl">
                    <h1>Resepku</h1>
                </div>
                <div>
                    <ul className="flex space-x-4">
                        <li><Link className="text-white hover:text-gray-400" to="/favorites">Favorit</Link></li>
                        <li><Link className="text-white hover:text-gray-400" to="/recipes">Tambah Recipe</Link></li>
                        <li><Link className="text-white hover:text-gray-400" to="/profile">Profile</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;