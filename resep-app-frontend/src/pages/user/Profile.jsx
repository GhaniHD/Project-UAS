// src/pages/Profile.js
import { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import axios from '../../services/axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.user) {
        console.log('Fetched user data:', response.data.user);
        setUser(response.data.user);
        setNewName(response.data.user.name || '');
      } else {
        setError('Invalid user data received');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.response?.data?.message || 'Failed to load user data');
      setLoading(false);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    if (auth) {
      fetchUserData();
    }
  }, [auth, navigate]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size should not exceed 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setNewPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handlePhotoUpdate = async () => {
    if (!newPhotoFile) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('photo', newPhotoFile);

      console.log('Uploading photo...');
      const response = await axios.put('/profile/photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Photo upload response:', response.data);

      // Update user state with new photo
      if (response.data && response.data.photo) {
        const photoUrl = response.data.photo;
        setUser(prev => ({
          ...prev,
          photo: photoUrl
        }));

        // Clear preview and file
        setNewPhotoFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl('');
        
        // Show success message
        setSuccessMessage('Photo updated successfully!');
        setError('');

        // Refresh user data
        await fetchUserData();
      }
    } catch (error) {
      console.error('Error updating photo:', error);
      setError(error.response?.data?.message || 'Failed to update photo');
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    if (!newName.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Updating name to:', newName.trim());
      
      const response = await axios.put('/profile/name', 
        { name: newName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Name update response:', response.data);

      if (response.data && response.data.user) {
        setUser(response.data.user);
        setNewName(response.data.user.name);
        setSuccessMessage('Profile updated successfully!');
        setError('');
        setEditing(false);
      }

      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">User data not available</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message Modal */}
        {successMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
              <p className="text-green-600 text-center font-semibold">{successMessage}</p>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setSuccessMessage('')}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-300 p-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/menu')}
                className="bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back
              </button>
              <h1 className="text-white text-2xl font-bold">Profile Settings</h1>
              <div className="w-24"></div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={previewUrl || (user.photo 
                    ? `http://localhost:5000${user.photo}`
                    : 'https://via.placeholder.com/150')}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
                  onError={(e) => {
                    console.log('Image load error, using placeholder');
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Camera className="w-5 h-5 text-orange-500" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Photo Update Buttons */}
              {newPhotoFile && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handlePhotoUpdate}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Save Photo
                  </button>
                  <button
                    onClick={() => {
                      setNewPhotoFile(null);
                      setPreviewUrl('');
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Profile Form */}
            {editing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setNewName(user.name || '');
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.name || 'Add Name'}
                </h2>
                <p className="text-gray-600 mt-2">{user.email}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;