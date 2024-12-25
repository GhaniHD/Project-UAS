import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../services/axios';
import AuthForm from '../../components/AuthForm';

const Register = () => {

  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // State untuk menampilkan pesan sukses

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
      console.log('registerFields:', registerFields);

      const nonFileData = {};
      Object.keys(formData).forEach((key) => {
        console.log('formData di dalam loop:', formData);
        if (formData[key] && registerFields.find(field => field.name === key).type !== 'file') {
          nonFileData[key] = formData[key];
        }
      });

      console.log('nonFileData:', nonFileData);

      const data = new FormData();
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      data.append('userData', JSON.stringify(nonFileData));

      console.log('FormData sebelum dikirim:', data);
      console.log('FormData entries:', Array.from(data.entries()));

      // Lakukan pemanggilan axios.post hanya sekali
      await axios.post('/auth/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set state menjadi true jika registrasi berhasil
      setRegistrationSuccess(true);

      // navigate('/login'); // Jangan redirect langsung, tampilkan pesan sukses
    } catch (err) {
      console.error('Error saat registrasi:', err);
      setError(err.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        {/* Tampilkan pesan sukses */}
        {registrationSuccess && (
          <p className="text-green-500 text-center mb-4">
            Registration successful! Please login.
          </p>
        )}

        {/* Tampilkan error */}
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
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;