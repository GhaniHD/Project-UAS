const AuthForm = ({ formData, setFormData, onSubmit, buttonText }) => {
  return (
    <form onSubmit={onSubmit} className="w-full bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e26816] focus:border-[#e26816]"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e26816] focus:border-[#e26816]"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#e26816] text-white py-3 rounded-full hover:bg-orange-600 transition-all duration-300"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default AuthForm;
