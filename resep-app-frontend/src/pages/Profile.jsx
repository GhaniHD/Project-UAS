import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Menggunakan konteks Auth untuk autentikasi

const Profile = () => {
  const { auth, logout } = useAuth();
  const [user, setUser] = useState(null); // State untuk menyimpan data pengguna
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState(false); // State untuk mode edit foto
  const [newPhoto, setNewPhoto] = useState(''); // State untuk menyimpan URL foto baru

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user); // Data pengguna dari backend
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    if (auth) fetchUserData();
  }, [auth]);

  const handlePhotoUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/profile/photo',
        { photo: newPhoto }, // Data foto baru
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser({ ...user, photo: response.data.photo }); // Perbarui foto di state
      setEditingPhoto(false);
      setNewPhoto('');
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading user data...</p>;
  }

  if (!user) {
    return <p className="text-red-500">User data not available.</p>;
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex">
        {/* Sidebar */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 w-1/3 p-6 flex flex-col items-center text-white">
          <img
            src={user.photo || 'https://via.placeholder.com/100'} // Tampilkan foto pengguna
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white mb-4"
          />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm">{user.email}</p>
          {editingPhoto ? (
            <div className="mt-4">
              <input
                type="text"
                placeholder="New photo URL"
                value={newPhoto}
                onChange={(e) => setNewPhoto(e.target.value)}
                className="p-2 border rounded mb-2"
              />
              <button
                onClick={handlePhotoUpdate}
                className="bg-white text-orange-500 px-4 py-2 rounded-full hover:bg-gray-100"
              >
                Save
              </button>
              <button
                onClick={() => setEditingPhoto(false)}
                className="bg-white text-red-500 px-4 py-2 rounded-full hover:bg-gray-100 ml-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingPhoto(true)}
              className="mt-4 bg-white text-orange-500 px-4 py-2 rounded-full hover:bg-gray-100"
            >
              Edit Photo
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6">
          <h3 className="text-xl font-semibold mb-4">Information</h3>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm font-semibold">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Phone</p>
              <p>{user.phone || 'Not provided'}</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4">Favorites</h3>
          {user.favorites && user.favorites.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {user.favorites.map((favorite, index) => (
                <li key={index}>{favorite}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No favorite items yet.</p>
          )}

          <button
            onClick={logout}
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
