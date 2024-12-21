import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { auth, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    if (auth) fetchUserData();
  }, [auth]);

  const handlePhotoUpdate = async () => {
    if (!newPhotoFile) return;
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('photo', newPhotoFile);

      const response = await axios.put('http://localhost:5000/profile/photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser({ ...user, photo: response.data.photo });
      setEditingPhoto(false);
      setNewPhotoFile(null);
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-center mt-10">Loading user data...</p>;
  }

  if (!user) {
    return <p className="text-red-500 text-center mt-10">User data not available.</p>;
  }

  const handleBackToHome = () => {
    navigate('/menu');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:flex">
        {/* Sidebar */}
        <div className="bg-gradient-to-r from-orange-700 to-orange-300 md:w-1/3 p-6 flex flex-col items-center text-white">
          <img
            src={user.photo || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white mb-4"
          />
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-sm">{user.email}</p>
          {editingPhoto ? (
            <div className="mt-4 w-full">
              <input
                type="file"
                onChange={(e) => setNewPhotoFile(e.target.files[0])}
                className="w-full p-2 border rounded mb-2 text-gray-700"
              />
              <div className="flex justify-center gap-2">
                <button
                  onClick={handlePhotoUpdate}
                  className="bg-white text-orange-500 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingPhoto(false);
                    setNewPhotoFile(null);
                  }}
                  className="bg-white text-red-500 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
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
        <div className="md:w-2/3 p-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">User Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm font-semibold text-gray-500">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Phone</p>
              <p>{user.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
            <button
              onClick={handleBackToHome}
              className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600"
            >
              Back to Home
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
