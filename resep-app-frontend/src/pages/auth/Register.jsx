import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../services/axios';
import AuthForm from '../../components/AuthForm';

const Register = () => {
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate(); // Gunakan useNavigate untuk redirect

  const registerFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      required: true,
    },
    {
      name: 'photo',
      label: 'Profile Photo (Optional)',
      type: 'file',
      required: false,
    },
  ];

  const handleSubmit = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match!');
      return;
    }

    try {
      const data = new FormData();

      // Iterasi langsung pada registerFields
      registerFields.forEach((field) => {
        if (field.type === 'file') {
          if (formData.photo) {
            data.append('photo', formData.photo);
          }
        } else {
          data.append(field.name, formData[field.name]);
        }
      });

      console.log('FormData entries:', Array.from(data.entries()));

      const response = await axios.post('/auth/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Registration successful:', response.data); // Log response untuk debugging
      setRegistrationSuccess(true);

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Error during registration:', err);
      setError(err.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        {registrationSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Registration successful. You will be redirected to the login page shortly.</span>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <AuthForm
          fields={registerFields}
          onSubmit={handleSubmit}
          buttonText="Register"
        />

        <div className="mt-4 text-center">
          <p className="text-sm">Already have an account?</p>
          <Link
            to="/login"
            className="text-orange-500 hover:text-orange-700 font-semibold"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;