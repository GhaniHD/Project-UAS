// FormComponents.jsx
import PropTypes from 'prop-types';

export const FormInput = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
    />
  </div>
);

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string
};

export const FormTextArea = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none h-32"
    />
  </div>
);

FormTextArea.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export const IngredientsList = ({ ingredients, onAdd, onRemove, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Ingredients
    </label>
    {ingredients.map((ingredient, index) => (
      <div key={index} className="flex space-x-2 mb-2">
        <input
          type="text"
          value={ingredient}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder="Enter ingredient"
          className="flex-grow px-4 py-3 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100"
        >
          <TrashIcon size={20} />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={onAdd}
      className="w-full flex items-center justify-center bg-orange-50 text-orange-600 p-3 rounded-xl hover:bg-orange-100"
    >
      <PlusIcon className="mr-2" />
      Add Ingredient
    </button>
  </div>
);

IngredientsList.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};
