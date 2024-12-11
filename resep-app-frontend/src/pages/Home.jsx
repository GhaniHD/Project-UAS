import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-between font-sans relative"
      style={{
        backgroundImage: 'url("../images/fix.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold tracking-wide">ResepKu</h1>
          <nav className="space-x-6">
            <Link
              to="/login"
              className="hover:underline text-sm sm:text-base transition duration-300 hover:text-orange-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:underline text-sm sm:text-base transition duration-300 hover:text-orange-200"
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content area with overlay */}
      <main className="relative flex flex-col items-center justify-center text-center py-24 px-6 flex-grow">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="max-w-3xl relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
            Selamat Datang di <span className="text-orange-400">ResepKu!</span>
          </h2>
          <p className="text-gray-200 text-lg sm:text-xl mb-8">
            Temukan berbagai resep terbaik atau bagikan kreasi masakan Anda kepada dunia!
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/login"
              className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-orange-500 border-2 border-orange-500 px-6 py-3 rounded-full shadow-lg hover:bg-orange-500 hover:text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Daftar
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4">
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