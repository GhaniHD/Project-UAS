import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import AuthForm from '../component/AuthForm';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token); // Simpan token
      alert('Login berhasil!');
      navigate('/menu'); // Redirect ke halaman menu setelah login
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <AuthForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        buttonText="Login"
      />
    </div>
  );
};

export default Login;
