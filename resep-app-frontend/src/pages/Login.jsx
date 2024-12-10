import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import AuthForm from '../component/AuthForm';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { auth, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate('/menu'); // Redirect to menu if already logged in
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', formData);
      const token = response.data.token;

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Call login function from AuthContext with token
      login(token);

      alert('Login successful!');
      navigate('/menu'); // Redirect to menu page
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
        
        <AuthForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText="Login"
        />

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
