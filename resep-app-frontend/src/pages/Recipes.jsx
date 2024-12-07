import { useEffect, useState } from 'react';
import axios from '../axios'; // Menggunakan instance Axios yang sudah dikonfigurasi

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newRecipe, setNewRecipe] = useState({ title: '', description: '', ingredients: [], steps: [] });
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [error, setError] = useState(null);

  // Fetch recipes on load
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/recipes');
        setRecipes(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat resep.');
      }
    };
    fetchRecipes();
  }, []);

  // Handle search query change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submit to add or edit a recipe
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecipe) {
        await axios.put(`/recipes/${editingRecipe._id}`, newRecipe);
        setEditingRecipe(null);
      } else {
        await axios.post('/recipes', newRecipe);
      }
      setNewRecipe({ title: '', description: '', ingredients: [], steps: [] });
      const response = await axios.get('/recipes');
      setRecipes(response.data); // Refresh the recipe list
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah atau memperbarui resep.');
    }
  };

  // Handle recipe edit
  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setNewRecipe({ title: recipe.title, description: recipe.description, ingredients: recipe.ingredients, steps: recipe.steps });
  };

  // Handle recipe delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/recipes/${id}`);
      const response = await axios.get('/recipes');
      setRecipes(response.data); // Refresh the recipe list
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus resep.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-center text-[#e26816] mb-8">Recipes</h1>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Search bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e26816]"
        />
      </div>

      {/* Recipe list */}
      <ul>
        {filteredRecipes.map((recipe) => (
          <li key={recipe._id} className="border-b py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-[#e26816]">{recipe.title}</h2>
              <p>{recipe.description}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(recipe)}
                className="bg-[#e26816] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-all duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(recipe._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add or Edit recipe form */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-[#e26816] mb-4">{editingRecipe ? 'Edit Recipe' : 'Add Recipe'}</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700">Title</label>
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
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={newRecipe.description}
              onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e26816]"
              required
            />
          </div>
          {/* Add more fields for ingredients and steps */}
          <button type="submit" className="bg-[#e26816] text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-all duration-300">
            {editingRecipe ? 'Update Recipe' : 'Add Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Recipes;
