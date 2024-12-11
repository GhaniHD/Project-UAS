import { useEffect, useState } from 'react';
import axios from '../axios'; // Pastikan axios sudah dikonfigurasi dengan baseURL

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    servings: '',
    cookingTime: '',
    ingredients: [''], // Memulai dengan satu input bahan
    image: null,
  });
  const [error, setError] = useState(null);

  // Mengambil token dari localStorage
  const token = localStorage.getItem('token'); // Pastikan token ada di localStorage

  // Fetching recipes from the backend
  const fetchRecipes = async () => {
    try {
      console.log('Fetching recipes...'); // Log sebelum permintaan
      const response = await axios.get('/recipes', {
        headers: {
          'Authorization': `Bearer ${token}`, // Sertakan token di header
        },
      });
      console.log('Response data:', response.data); // Log data respons
      setRecipes(response.data); // Menyimpan resep yang diterima ke state
    } catch (err) {
      console.error('Error fetching recipes:', err.response?.data || err.message);
      setError('Gagal mengambil data resep.');
    }
  };

  // Mengambil resep yang sudah ada ketika komponen dimuat
  useEffect(() => {
    fetchRecipes();
  }, []); // Menjalankan sekali saat komponen dimuat

  // Handle form submission to add a new recipe
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validasi input
  if (!newRecipe.title || !newRecipe.ingredients || newRecipe.ingredients.length === 0 || newRecipe.ingredients.some(i => i.trim() === '')) {
    setError('Nama resep dan bahan-bahan wajib diisi.');
    console.log('Error: Nama resep atau bahan-bahan tidak valid');
    return;
  }

  const recipeData = {
    title: newRecipe.title,
    description: newRecipe.description,
    servings: newRecipe.servings,
    cookingTime: newRecipe.cookingTime,
    ingredients: newRecipe.ingredients,
  };

  // Log data untuk memastikan
  console.log('Recipe Data before sending:', recipeData);

  try {
    const response = await axios.post('/recipes', recipeData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Pastikan tipe konten yang benar
      },
    });

    console.log('Response after adding recipe:', response.data);

    // Reset form setelah berhasil
    setNewRecipe({
      title: '',
      description: '',
      servings: '',
      cookingTime: '',
      ingredients: [''],
      image: null,
    });

    fetchRecipes(); // Ambil data resep terbaru setelah berhasil menambah
  } catch (err) {
    console.error('Error:', err.response?.data || err);
    setError(err.response?.data?.message || 'Gagal menambah resep.');
  }
};
  

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewRecipe({ ...newRecipe, image: file });
  };

  // Handle ingredient change
  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...newRecipe.ingredients];
    updatedIngredients[index] = value;
    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
  };

  // Add a new ingredient field
  const addIngredient = () => {
    setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, ''] });
  };

  // Remove an ingredient field
  const removeIngredient = (index) => {
    const updatedIngredients = newRecipe.ingredients.filter((_, i) => i !== index);
    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-extrabold text-center text-[#e26816] mb-8">Tulis Resep Baru</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center mb-6">
          <label htmlFor="image" className="cursor-pointer">
            {newRecipe.image ? (
              <img
                src={URL.createObjectURL(newRecipe.image)}
                alt="Preview"
                className="w-40 h-40 object-cover mx-auto rounded-lg border"
              />
            ) : (
              <div className="w-40 h-40 mx-auto bg-gray-200 rounded-lg flex items-center justify-center border">
                <img
                  src="/path-to-camera-icon.png"
                  alt="Camera Icon"
                  className="w-16 h-16 opacity-50"
                />
              </div>
            )}
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <p className="mt-2 text-gray-600">Tambahkan foto resep</p>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Nama Resep</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newRecipe.title}
            onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e26816]"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={newRecipe.description}
            onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e26816]"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="servings" className="block text-gray-700 font-medium mb-2">Jumlah Porsi</label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={newRecipe.servings}
              onChange={(e) => setNewRecipe({ ...newRecipe, servings: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e26816]"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="cookingTime" className="block text-gray-700 font-medium mb-2">Durasi Memasak (menit)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={newRecipe.cookingTime}
            onChange={(e) => setNewRecipe({ ...newRecipe, cookingTime: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e26816]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Bahan-bahan</label>
          {newRecipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e26816]"
                required
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="ml-2 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-4 py-2 text-white bg-[#e26816] rounded-md hover:bg-orange-600"
          >
            Tambah Bahan
          </button>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#e26816] text-white rounded-md hover:bg-orange-600"
        >
          Tambahkan Resep
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-3xl font-semibold text-[#e26816]">Resep Saya</h2>
        <div className="mt-6">
          {recipes.length > 0 ? (
            <ul>
              {recipes.map((recipe) => (
                <li key={recipe.id} className="mb-4">
                  <h3 className="text-xl font-semibold">{recipe.title}</h3>
                  <p>{recipe.description}</p>
                  <p><strong>Porsi:</strong> {recipe.servings}</p>
                  <p><strong>Durasi Memasak:</strong> {recipe.cookingTime} menit</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Tidak ada resep yang ditampilkan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
