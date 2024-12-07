// src/pages/MenuUtama.jsx
import Navbar from '../component/Navbar';

const MenuUtama = () => {
    return (
        <div>
            <Navbar style={{ backgroundColor: 'orange' }} />
            <section className="resep-section p-6">
                <h1 className="text-3xl font-bold mb-4">Resep Makanan</h1>
                <div className="grid grid-cols-4 gap-4">
                    {['Resep 1', 'Resep 2', 'Resep 3', 'Resep 4'].map((resep, index) => (
                        <div key={index} className="card p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                            <a href="#">
                                <img src={`path/to/image${index + 1}.jpg`} alt={resep} className="w-full h-32 object-cover rounded-t-lg" />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{resep}</h2>
                                    <p>Deskripsi singkat {resep}</p>
                                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300">
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
