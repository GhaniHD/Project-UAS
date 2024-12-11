// src/pages/MenuUtama.jsx
import Navbar from '../component/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';

const MenuUtama = () => {
    const [favorites, setFavorites] = useState([]);
    const [modalData, setModalData] = useState(null);

    const toggleFavorite = (index) => {
        if (favorites.includes(index)) {
            setFavorites(favorites.filter((fav) => fav !== index));
        } else {
            setFavorites([...favorites, index]);
        }
    };

    const openModal = (resep) => {
        const recipeDetails = {
            description: `Deskripsi lengkap untuk ${resep}. Ini adalah resep yang sangat lezat dan mudah dibuat.`,
            ingredients: ["Bahan 1", "Bahan 2", "Bahan 3", "Bahan 4"],
        };
        setModalData(recipeDetails);
    };

    const closeModal = () => setModalData(null);

    return (
        <div>
            <Navbar style={{ backgroundColor: 'orange' }} />
            <section className="resep-section p-6 bg-orange-50 min-h-screen">
                <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">Resep Makanan</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {["Resep 1", "Resep 2", "Resep 3", "Resep 4"].map((resep, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                        >
                            <div className="relative">
                                <img
                                    src={`path/to/image${index + 1}.jpg`}
                                    alt={resep}
                                    className="w-full h-40 object-cover"
                                />
                                <button
                                    className="absolute top-2 right-2 bg-transparent border-none outline-none"
                                    onClick={() => toggleFavorite(index)}
                                >
                                    <FontAwesomeIcon
                                        icon={favorites.includes(index) ? solidHeart : regularHeart}
                                        className={favorites.includes(index) ? "text-red-500" : "text-gray-400"}
                                    />
                                </button>
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-bold text-orange-700 mb-2">{resep}</h2>
                                <div className="flex justify-between text-sm text-gray-600 mb-4">
                                    <span><FontAwesomeIcon icon={faUsers} /> 4 Orang</span>
                                    <span><FontAwesomeIcon icon={faClock} /> 30 Menit</span>
                                </div>
                                <button
                                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors duration-300 w-full mb-2"
                                    onClick={() => toggleFavorite(index)}
                                >
                                    {favorites.includes(index) ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300 w-full"
                                    onClick={() => openModal(resep)}
                                >
                                    Lihat Resep
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {modalData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold text-orange-600 mb-4">Deskripsi Resep</h2>
                        <p className="text-gray-700 mb-4">{modalData.description}</p>
                        <h3 className="text-xl font-bold text-orange-500 mb-2">Bahan-bahan:</h3>
                        <ul className="list-disc list-inside text-gray-700">
                            {modalData.ingredients.map((ingredient, i) => (
                                <li key={i}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuUtama;