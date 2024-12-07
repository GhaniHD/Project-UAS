import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import AuthForm from "../component/AuthForm";

const Register = () => {
  const navigate = useNavigate();

  // State untuk form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State untuk menampilkan error
  const [error, setError] = useState("");

  // Fungsi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", formData);
      navigate("/login"); // Redirect ke halaman login setelah berhasil
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center">Register</h1>
      {error && <div className="text-red-500 text-center">{error}</div>}

      <AuthForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        buttonText="Register"
      />
    </div>
  );
};

export default Register;
