import { useState } from 'react';
import { HeartIcon, ClockIcon, UsersIcon, EyeIcon } from 'lucide-react';
import Navbar from '../component/Navbar';

const Favorit = () => {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: 'Nasi Goreng Spesial',
      description: 'Nasi goreng dengan bumbu rahasia keluarga',
      servings: 4,
      cookingTime: 30,
      ingredients: ['Nasi', 'Kecap', 'Bawang Merah', 'Telur'],
      imageUrl: 'https://example.com/nasigoreng.jpg'
    },
    {
      id: 2,
      title: 'Sate Ayam Madura',
      description: 'Sate ayam dengan bumbu kacang yang nikmat',
      servings: 6,
      cookingTime: 45,
      ingredients: ['Ayam', 'Bumbu Sate', 'Kacang', 'Kecap'],
      imageUrl: 'https://example.com/sate.jpg'
    },
  ]);

  const [modalData, setModalData] = useState(null);

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const openModal = (recipe) => {
    setModalData(recipe);
  };

  const closeModal = () => setModalData(null);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Navbar />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-4 py-8">
        {favorites.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white border-2 border-orange-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => removeFavorite(recipe.id)}
                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <HeartIcon
                  size={20}
                  className="text-red-500 fill-red-500"
                />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-orange-600 mb-2">{recipe.title}</h3>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <UsersIcon size={16} className="mr-2 text-orange-500" />
                  {recipe.servings} Orang
                </span>
                <span className="flex items-center">
                  <ClockIcon size={16} className="mr-2 text-orange-500" />
                  {recipe.cookingTime} Menit
                </span>
              </div>
              <button
                onClick={() => removeFavorite(recipe.id)}
                className="w-full bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100 transition-colors mb-2"
              >
                Hapus dari Favorit
              </button>
              <button
                onClick={() => openModal(recipe)}
                className="w-full bg-gray-50 text-gray-600 p-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <EyeIcon size={16} className="mr-2" />
                Lihat Resep
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-orange-600 mb-4">{modalData.title}</h2>
            <img
              src={modalData.imageUrl}
              alt={modalData.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <p className="text-gray-700 mb-4">{modalData.description}</p>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <UsersIcon size={16} className="mr-2 text-orange-500" />
                {modalData.servings} Orang
              </span>
              <span className="flex items-center">
                <ClockIcon size={16} className="mr-2 text-orange-500" />
                {modalData.cookingTime} Menit
              </span>
            </div>
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

export default Favorit;
