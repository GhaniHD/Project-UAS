// src/pages/MenuUtama.jsx
import Navbar from '../component/Navbar';

const MenuUtama = () => {
    return (
        <div>
            <Navbar style={{ backgroundColor: 'orange' }} />
            <section className="resep-section p-6 bg-orange-50 min-h-screen">
                <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">Resep Makanan</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {['Resep 1', 'Resep 2', 'Resep 3', 'Resep 4'].map((resep, index) => (
                        <div key={index} className="card p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                            <a href="#" className="block">
                                <img src={`path/to/image${index + 1}.jpg`} alt={resep} className="w-full h-48 object-cover rounded-t-lg" />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-orange-700 mb-2">{resep}</h2>
                                    <p className="text-gray-600 mb-4">Deskripsi singkat {resep}</p>
                                    <button className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700 transition-colors duration-300 w-full">
                                        Tambah ke Favorit
                                    </button>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MenuUtama;
