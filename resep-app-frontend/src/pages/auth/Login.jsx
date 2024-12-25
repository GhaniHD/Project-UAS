import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../services/axios';
import AuthForm from '../../components/AuthForm';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/menu');
    }
  }, [navigate]);

  const loginFields = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ];

  const handleSubmit = async (formData) => {
    try {
      console.log('Data yang dikirim ke backend (login):', formData);

      const response = await axios.post('/auth/login', formData);
      const token = response.data.token;

      console.log('Response dari backend (login):', response);

      localStorage.setItem('token', token);
      login(token);
      navigate('/menu');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed!';
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <AuthForm fields={loginFields} onSubmit={handleSubmit} buttonText="Login" />

        <div className="mt-4 text-center">
          <p className="text-sm">Dont have an account?</p>
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Register here
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;