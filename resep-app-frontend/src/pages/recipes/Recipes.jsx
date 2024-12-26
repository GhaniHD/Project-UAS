import { useEffect, useState, useRef } from 'react';
import { PlusIcon, TrashIcon, ImageIcon, EditIcon } from 'lucide-react';
import axios from 'axios';

const RecipePage = () => {
  // Recipe Creation State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState([{ item: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState([{ description: '', order: 1 }]);
  const [image, setImage] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const imageInputRef = useRef(null);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Fetch recipes when component mounts
  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/recipes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMyRecipes(response.data.recipes || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Failed to fetch recipes');
    }
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { item: '', quantity: '', unit: '' }
    ]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updatedIngredients);
  };

  const addStep = () => {
    setSteps([
      ...steps,
      { description: '', order: steps.length + 1 }
    ]);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      const updatedSteps = steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({
          ...step,
          order: i + 1
        }));
      setSteps(updatedSteps);
    }
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = steps.map((step, i) =>
      i === index ? { ...step, description: value } : step
    );
    setSteps(updatedSteps);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setServings('');
    setCookingTime('');
    setIngredients([{ item: '', quantity: '', unit: '' }]);
    setSteps([{ description: '', order: 1 }]);
    setImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add a recipe');
      return;
    }
   
    // Validate required fields
    if (!title || !description || !ingredients.length || !steps.length) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('servings', Number(servings));
    formData.append('cookingTime', Number(cookingTime));
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('steps', JSON.stringify(steps));

    if (image) {
      formData.append('image', image);
    }
   
    // Validate ingredients and steps
    if (ingredients.some(ing => !ing.item || !ing.quantity) || 
        steps.some(step => !step.description)) {
      alert('Please fill in all ingredients and steps details');
      return;
    }
   
    try {
      const response = await axios.post('http://localhost:5000/recipes', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
   
      if (response.status === 200 || response.status === 201) {
        alert('Recipe added successfully!');
        resetForm();
        fetchMyRecipes();
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to add recipe');
    }
   };
  
  const handleEdit = async (recipe) => {
    try {
      setEditingRecipe(recipe);
      setTitle(recipe.title || '');
      setDescription(recipe.description || '');
      setServings((recipe.servings || '').toString());
      setCookingTime((recipe.cookingTime || '').toString());
      
      const formattedIngredients = Array.isArray(recipe.ingredients) 
        ? recipe.ingredients.map(ing => ({
            item: ing.item || '',
            quantity: ing.quantity || '',
            unit: ing.unit || ''
          }))
        : [{ item: '', quantity: '', unit: '' }];
      
      const formattedSteps = Array.isArray(recipe.steps)
        ? recipe.steps.map((step, index) => ({
            description: step.description || '',
            order: index + 1
          }))
        : [{ description: '', order: 1 }];
      
      setIngredients(formattedIngredients);
      setSteps(formattedSteps);
      setImage(null);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error preparing recipe for edit:', error);
      alert('Failed to load recipe for editing');
    }
  };

  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/recipes/${recipeId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.status === 200) {
          alert('Recipe deleted successfully!');
          fetchMyRecipes();
        }
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingRecipe) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('servings', Number(servings));
    formData.append('cookingTime', Number(cookingTime));
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('steps', JSON.stringify(steps));
    
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/recipes/${editingRecipe.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Recipe updated successfully!');
        setIsEditModalOpen(false);
        resetForm();
        fetchMyRecipes();
        setEditingRecipe(null);
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
         <div className="max-w-2xl mx-auto mb-6">
          <a 
            href="/menu" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Kembali ke Menu Utama
          </a>
        </div>

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
              className="w-full h-72 object-cover rounded-xl shadow-lg"
            />
            <button 
              onClick={() => {
                setImage(null);
                if (imageInputRef.current) imageInputRef.current.value = '';
              }}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
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
                className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Image
              </label>
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:border-orange-400">
                <ImageIcon className="mr-2 text-orange-500" />
                <span className="text-gray-600">
                  {image ? image.name : 'Choose Image'}
                </span>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
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
              className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none h-32"
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
                className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
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
                className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
          <label className="block text-sm font-medium">Ingredients</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                placeholder="Quantity"
                className="w-24 p-2 border rounded"
              />
              <input
                type="text"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                placeholder="Unit"
                className="w-24 p-2 border rounded"
              />
              <input
                type="text"
                value={ingredient.item}
                onChange={(e) => handleIngredientChange(index, 'item', e.target.value)}
                placeholder="Ingredient"
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-2 text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center gap-2 text-orange-500"
          >
            <PlusIcon className="w-5 h-5" /> Add Ingredient
          </button>
        </div>

        {/* Steps Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Steps</label>
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <span className="w-8 text-center py-2">{step.order}.</span>
              <input
                type="text"
                value={step.description}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder="Describe this step"
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="p-2 text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="flex items-center gap-2 text-orange-500"
          >
            <PlusIcon className="w-5 h-5" /> Add Step
          </button>
        </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 font-bold text-lg shadow-lg shadow-orange-200"
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
          {myRecipes.length > 0 ? (
            myRecipes.map((recipe) => (
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
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      onClick={() => handleEdit(recipe)}
                      className="bg-white/80 p-2 rounded-full hover:bg-white"
                    >
                      <EditIcon size={20} className="text-orange-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="bg-white/80 p-2 rounded-full hover:bg-white"
                    >
                      <TrashIcon size={20} className="text-red-600" />
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

                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500">
              No recipes found. Create your first recipe above!
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-600">Edit Recipe</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                  setEditingRecipe(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recipe Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none h-32"
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
                    className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
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
                    className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
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
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      placeholder="Quantity"
                      className="w-24 px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      placeholder="Unit"
                      className="w-24 px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={ingredient.item}
                      onChange={(e) => handleIngredientChange(index, 'item', e.target.value)}
                      placeholder="Ingredient"
                      className="flex-grow px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100"
                    >
                      <TrashIcon size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  className="w-full flex items-center justify-center bg-orange-50 text-orange-600 p-3 rounded-xl hover:bg-orange-100"
                >
                  <PlusIcon className="mr-2" />
                  Add Ingredient
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Steps
                </label>
                {steps.map((step, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <span className="px-3 py-3">{step.order}.</span>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      placeholder="Describe this step"
                      className="flex-grow px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100"
                    >
                      <TrashIcon size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStep}
                  className="w-full flex items-center justify-center bg-orange-50 text-orange-600 p-3 rounded-xl hover:bg-orange-100"
                >
                  <PlusIcon className="mr-2" />
                  Add Step
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Update Image (Optional)
                </label>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:border-orange-400">
                  <ImageIcon className="mr-2 text-orange-500" />
                  <span className="text-gray-600">
                    {image ? image.name : 'Choose New Image'}
                  </span>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 font-semibold"
                >
                  Update Recipe
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                    setEditingRecipe(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePage;