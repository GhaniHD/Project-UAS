import { useState, useEffect } from 'react'; // Import useState and useEffect
import PropTypes from 'prop-types';

const AuthForm = ({ fields, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialFormData = {};
    fields.forEach((field) => {
      if (field.type !== 'file') {
        initialFormData[field.name] = '';
      }
    });
    setFormData(initialFormData);
  }, [fields]);

  const handleChange = (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const getFormValue = (field) => {
    if (field.type === 'file') {
      return undefined; // Don't set value for file inputs
    }
    return formData[field.name] || '';
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            value={getFormValue(field)}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            accept={field.type === 'file' ? 'image/*' : undefined}
            required={field.required}
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full py-2 bg-orange-600 text-white rounded"
      >
        {buttonText}
      </button>
    </form>
  );
};

AuthForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'email', 'password', 'file']).isRequired,
      required: PropTypes.bool,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default AuthForm;