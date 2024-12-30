import { useState, useEffect } from 'react';
import { HeartIcon, ClockIcon, UsersIcon, EyeIcon, UserIcon } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const Favorit = () => {
  const [favorites, setFavorites] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/favorites', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:5000/favorites/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Refresh favorites after removing
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove from favorites');
    }
  };

  const openModal = (recipe) => {
    setModalData(recipe);
  };

  const closeModal = () => setModalData(null);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchFavorites}
            className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-xl hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-8 text-center">
          Resep Favorit Saya
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Belum ada resep favorit.</p>
            <a 
              href="/menu" 
              className="mt-4 inline-block bg-orange-600 text-white px-6 py-2 rounded-xl hover:bg-orange-700"
            >
              Jelajahi Resep
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white border-2 border-orange-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img 
                    src={recipe.imageUrl || 'https://via.placeholder.com/400x320'} 
                    alt={recipe.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x320';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-orange-600 mb-2">{recipe.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <UserIcon size={16} className="mr-2 text-orange-500" />
                    <span>{recipe.author}</span>
                  </div>
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
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {recipe.description}
                  </p>
                  <button
                    onClick={() => removeFavorite(recipe.id)}
                    className="w-full bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100 transition-colors mb-2"
                  >
                    <HeartIcon size={16} className="inline mr-2 fill-red-500" />
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
        )}
      </div>

      {/* Modal Detail Resep */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-orange-600 mb-2">{modalData.title}</h2>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <UserIcon size={16} className="mr-2 text-orange-500" />
              <span>{modalData.author}</span>
            </div>
            <img 
              src={modalData.imageUrl || 'https://via.placeholder.com/400x320'} 
              alt={modalData.title} 
              className="w-full h-48 object-cover rounded-xl mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x320';
              }}
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
            <div className="mb-4">
              <h3 className="text-xl font-bold text-orange-500 mb-2">Bahan-bahan:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {modalData.ingredients?.map((ingredient, i) => (
                  <li key={i}>
                    {`${ingredient.quantity} ${ingredient.unit} ${ingredient.item}`.trim()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-orange-500 mb-2">Langkah-langkah:</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                {modalData.steps?.map((step, i) => (
                  <li key={i}>{step.description}</li>
                ))}
              </ol>
            </div>
            <button
              onClick={() => {
                removeFavorite(modalData.id);
                closeModal();
              }}
              className="w-full bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center"
            >
              <HeartIcon size={16} className="mr-2 fill-red-500" />
              Hapus dari Favorit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorit;