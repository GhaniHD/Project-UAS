import React from 'react';
import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { auth, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

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
        setNewName(response.data.user.name || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    if (auth) fetchUserData();
  }, [auth]);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('File size should not exceed 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setNewPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setEditingPhoto(true);
    }
  };

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
      setPreviewUrl('');
      setError('');
    } catch (error) {
      console.error('Error updating photo:', error);
      setError('Failed to update photo');
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      setError('Name cannot be empty');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/profile/name', 
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setUser({ ...user, name: response.data.name });
      setEditingName(false);
      setError('');
    } catch (error) {
      console.error('Error updating name:', error);
      setError('Failed to update name');
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-center mt-10">Loading user data...</p>;
  }

  if (!user) {
    return <p className="text-red-500 text-center mt-10">User data not available.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:flex">
        {/* Sidebar */}
        <div className="bg-gradient-to-r from-orange-700 to-orange-300 md:w-1/3 p-6 flex flex-col items-center text-white">
          <div className="relative group">
            <img
              src={previewUrl || user.photo || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white mb-4 object-cover"
            />
            <div 
              className="absolute bottom-4 right-0 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-5 h-5 text-orange-500" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {editingPhoto && (
            <div className="mt-2 flex justify-center gap-2">
              <button
                onClick={handlePhotoUpdate}
                className="bg-white text-orange-500 px-4 py-2 rounded-full hover:bg-gray-100"
              >
                Save Photo
              </button>
              <button
                onClick={() => {
                  setEditingPhoto(false);
                  setNewPhotoFile(null);
                  setPreviewUrl('');
                }}
                className="bg-white text-red-500 px-4 py-2 rounded-full hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          )}
          
          {editingName ? (
            <div className="mt-4 w-full">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border rounded mb-2 text-gray-700"
                placeholder="Enter your name"
              />
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleNameUpdate}
                  className="bg-white text-orange-500 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  Save Name
                </button>
                <button
                  onClick={() => {
                    setEditingName(false);
                    setNewName(user.name || '');
                  }}
                  className="bg-white text-red-500 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold">{user.name || 'Add Name'}</h2>
              <button
                onClick={() => setEditingName(true)}
                className="mt-2 text-sm underline hover:text-gray-200"
              >
                Edit Name
              </button>
            </div>
          )}
          
          <p className="text-sm mt-2">{user.email}</p>
        </div>

        {/* Main Content */}
        <div className="md:w-2/3 p-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">User Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm font-semibold text-gray-500">Email</p>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/menu')}
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