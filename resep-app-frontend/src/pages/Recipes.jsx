import React, { useState } from 'react';

const Recipes = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [image, setImage] = useState(null);

  // Menambah input bahan
  const addIngredient = () => {
    setIngredients([...ingredients, '']); // Menambah input bahan baru
  };

  // Menghapus input bahan berdasarkan index
  const removeIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients); // Menghapus bahan berdasarkan index
  };

  // Mengubah nilai bahan di indeks tertentu
  const handleIngredientChange = (index, value) => {
    const updatedIngredients = ingredients.map((ingredient, i) => 
      i === index ? value : ingredient
    );
    setIngredients(updatedIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi data
    if (!title || !description || ingredients.length === 0) {
      alert('Nama resep dan bahan-bahan wajib diisi.');
      return;
    }

    // Pastikan servings dan cookingTime adalah angka
    const servingsNumber = Number(servings);
    const cookingTimeNumber = Number(cookingTime);

    // Memastikan data yang dikirim sesuai format
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('servings', servingsNumber);
    formData.append('cookingTime', cookingTimeNumber);
    formData.append('ingredients', JSON.stringify(ingredients));

    // Jika ada file gambar, tambahkan ke FormData
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:5000/recipes', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Menggunakan token untuk otentikasi
        },
      });

      const data = await response.json();
      console.log('Response after adding recipe:', data);

      if (response.ok) {
        alert('Recipe added successfully');

        // Reset form setelah sukses
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
    setImage(e.target.files[0]); // Menangkap file gambar
  };

  return (
    <div className="max-w-lg mx-auto bg-orange-50 p-6 rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-semibold text-center mb-6 text-orange-700">Add Recipe</h1>

      {image && (
        <div className="mb-6">
          <img
            src={URL.createObjectURL(image)}
            alt="Cover"
            className="w-full h-56 object-cover rounded-lg mb-4"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Recipe Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Recipe Title"
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recipe Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Recipe Description"
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Servings</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="Servings"
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cooking Time</label>
          <input
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            placeholder="Cooking Time"
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ingredients</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder="Ingredient"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addIngredient}
            className="mt-3 w-full bg-orange-600 text-white p-3 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Add Ingredient
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-orange-600 text-white p-3 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Submit Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default Recipes;
