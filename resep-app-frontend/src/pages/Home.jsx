import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-orange-50 via-white to-orange-100 font-sans">
      {/* Header */}
      <header className="bg-[#e26816] text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">ResepKu</h1>
          <nav className="space-x-6">
            <Link
              to="/login"
              className="hover:underline text-sm sm:text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:underline text-sm sm:text-base"
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center py-24 px-6">
        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#e26816] leading-tight mb-6">
            Selamat Datang di ResepKu!
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl mb-8">
            Temukan berbagai resep terbaik atau bagikan kreasi masakan Anda kepada dunia!
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/login"
              className="bg-[#e26816] text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-orange-500 transition-transform transform hover:scale-105 text-sm sm:text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-[#e26816] border-2 border-[#e26816] px-6 py-3 rounded-full shadow-md hover:bg-[#e26816] hover:text-white hover:shadow-lg transition-transform transform hover:scale-105 text-sm sm:text-base"
            >
              Daftar
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#e26816] text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm sm:text-base">
            © {new Date().getFullYear()} ResepKu. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
