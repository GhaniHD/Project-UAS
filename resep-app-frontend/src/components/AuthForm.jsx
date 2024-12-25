import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthForm = ({ fields, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialFormData = {};
    fields.forEach((field) => {
      // Inisialisasi semua field, termasuk file, dengan nilai default
      initialFormData[field.name] = field.type === 'file' ? null : '';
    });
    setFormData(initialFormData);
  }, [fields]);

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    const fieldValue = type === 'file' ? files[0] : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue,
    }));
  };

  // Hapus fungsi getFormValue, tidak diperlukan lagi

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
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-900"
          >
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            // value tidak perlu di-set untuk input file
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            accept={field.type === 'file' ? 'image/*' : undefined}
            required={field.required}
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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