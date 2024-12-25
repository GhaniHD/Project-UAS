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
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.user;
        setUser(userData);
        setNewName(userData.name || '');
        setNewEmail(userData.email || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    if (auth) fetchUserData();
  }, [auth]);

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

      const response = await axios.put('/profile/photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser({ ...user, photo: response.data.photo });
      setNewPhotoFile(null);
      setPreviewUrl('');
      setSuccessMessage('Photo updated successfully!');
      setError('');
    } catch (error) {
      console.error('Error updating photo:', error);
      setError('Failed to update photo');
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updatedData = {};

      if (newName !== user.name) {
        updatedData.name = newName;
      }

      if (newEmail !== user.email) {
        updatedData.email = newEmail;
      }

      if (newPassword) {
        updatedData.password = newPassword;
      }

      // Only send the request if there are changes
      if (Object.keys(updatedData).length > 0) {
        const response = await axios.put('/profile', updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setUser({ ...user, ...response.data.user });
        setSuccessMessage('Profile updated successfully!');
        setError('');
      } else {
        setSuccessMessage('No changes made to the profile.');
      }

      setEditing(false);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to update profile');
      }
    }
  };
  

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-10">Loading user data...</p>
    );
  }

  if (!user) {
    return (
      <p className="text-red-500 text-center mt-10">
        User data not available.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
      {successMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <p className="text-green-600">{successMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setSuccessMessage('');
                  setEditing(false);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="p-8 flex flex-col items-center text-gray-800 bg-gradient-to-r from-orange-500 to-yellow-300">
          <div className="flex justify-start w-full">
            <button
              onClick={() => navigate('/menu')}
              className="bg-white text-orange-500 font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back
            </button>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-6 mt-4">
            User Information
          </h3>
          <div className="relative group mb-6">
            <img
              src={
                previewUrl ||
                (user.photo
                  ? `http://localhost:5000/${user.photo}`
                  : 'https://via.placeholder.com/150')
              }
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-md"
            />
            <div
              className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 shadow-md transition-all duration-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-6 h-6 text-orange-500" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {newPhotoFile && (
              <div className="mt-2 flex justify-center gap-2">
                <button
                  onClick={handlePhotoUpdate}
                  className="bg-white text-orange-500 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  Save Photo
                </button>
                <button
                  onClick={() => {
                    setNewPhotoFile(null);
                    setPreviewUrl('');
                  }}
                  className="bg-white text-red-500 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleProfileUpdate} className="w-full mt-4">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-white text-sm font-bold mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex justify-center gap-2">
                <button
                  type="submit"
                  className="bg-white text-orange-500 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setNewName(user.name || '');
                    setNewEmail(user.email || '');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                  className="bg-white text-red-500 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center mt-4">
              <h2 className="text-2xl font-semibold text-white">
                {user.name || 'Add Name'}
              </h2>
              <p className="text-s mt-2 text-white">{user.email}</p>
              <div className="mt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-gray-100 text-orange-500 font-bold px-6 py-3 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-200"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;