import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../routes/axios";
import AuthForm from "../../components/AuthForm";
import { Link } from "react-router-dom";

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
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <AuthForm
          formData={formData}
          setFormData={setFormData}
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
