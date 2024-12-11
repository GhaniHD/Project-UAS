import { useState } from 'react';
import { PlusIcon, TrashIcon, ImageIcon, EditIcon, EyeIcon } from 'lucide-react';

const RecipePage = () => {
  // Recipe Creation State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [image, setImage] = useState(null);

  // My Recipes State
  const [myRecipes, setMyRecipes] = useState([
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
    }
  ]);

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = ingredients.map((ingredient, i) => 
      i === index ? value : ingredient
    );
    setIngredients(updatedIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || ingredients.length === 0) {
      alert('Nama resep dan bahan-bahan wajib diisi.');
      return;
    }

    const servingsNumber = Number(servings);
    const cookingTimeNumber = Number(cookingTime);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('servings', servingsNumber);
    formData.append('cookingTime', cookingTimeNumber);
    formData.append('ingredients', JSON.stringify(ingredients));

    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:5000/recipes', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      console.log('Response after adding recipe:', data);

      if (response.ok) {
        alert('Recipe added successfully');

        setTitle('');
        setDescription('');
        setServings('');
        setCookingTime('');
        setIngredients([]);
        setImage(null);
      } else {
        alert(data.message || 'Failed to add recipe');
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Error submitting recipe');
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Recipe Creation Form */}
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden p-8 mt-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-orange-600 tracking-tight">
            Create New Recipe
          </h1>
          <p className="text-gray-500 mt-2">Share your culinary masterpiece</p>
        </div>

        {image && (
          <div className="mb-6 relative group">
            <img
              src={URL.createObjectURL(image)}
              alt="Recipe Preview"
              className="w-full h-72 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <TrashIcon size={20} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipe Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter recipe name"
                className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Image
              </label>
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:border-orange-400 transition-colors">
                <ImageIcon className="mr-2 text-orange-500" />
                <span className="text-gray-600">
                  {image ? image.name : 'Choose Image'}
                </span>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipe Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your recipe"
              className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none transition-colors h-32"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Servings
              </label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="Number of servings"
                className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cooking Time (minutes)
              </label>
              <input
                type="number"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                placeholder="Total cooking time"
                className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ingredients
            </label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder="Enter ingredient"
                  className="flex-grow px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <TrashIcon size={20} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="w-full flex items-center justify-center bg-orange-50 text-orange-600 p-3 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <PlusIcon className="mr-2" />
              Add Ingredient
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 transition-colors font-bold text-lg shadow-lg shadow-orange-200"
          >
            Submit Recipe
          </button>
        </form>
      </div>

      {/* My Recipes Section */}
      <div className="max-w-4xl mx-auto mt-12 bg-white shadow-2xl rounded-2xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-orange-600 tracking-tight">
            My Recipes
          </h2>
          <p className="text-gray-500 mt-2">Your culinary collection</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {myRecipes.map((recipe) => (
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
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
                    <EditIcon size={20} className="text-orange-600" />
                  </button>
                  <button className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
                    <EyeIcon size={20} className="text-orange-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-orange-600 mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>🍽️ {recipe.servings} Servings</span>
                  <span>⏰ {recipe.cookingTime} mins</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <span 
                        key={index} 
                        className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipePage;