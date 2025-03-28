import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiUpload, FiUser } from 'react-icons/fi';

const UserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Populate the form with user details for editing or reset for new user
  useEffect(() => {
    if (isOpen) {
      setFormData({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        avatar: user?.avatar || ''
      });
      setAvatarPreview(user?.avatar || null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (
      formData.first_name.trim() &&
      formData.last_name.trim() &&
      formData.email.trim()
    ) {
      onSave(formData);
      onClose();
    } else {
      alert('Please fill out all fields!');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-grey bg-opacity-100 z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-gray-200  rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text mb-6 text-center">
              {user?.id ? 'Edit User' : 'Add New User'}
            </h2>

            {/* Avatar Upload and Form Inputs */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100 shadow-md transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-emerald-200 shadow-md transition-all duration-300 group-hover:scale-105">
                    <FiUser size={64} className="text-emerald-500" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden "
                />
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-emerald-500 hover:cursor-pointer text-white p-2 rounded-full shadow-md hover:bg-emerald-600 transition-colors duration-300"
                >
                  <FiUpload size={18} />
                </button>
              </div>

              <div className="w-full space-y-4">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center hover: cursor-pointer bg-emerald-500 text-white p-3 rounded-lg hover:bg-emerald-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50"
              >
                <FiCheck className="mr-2" /> {user?.id ? 'Save Changes' : 'Add User'}
              </button>

              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center hover: cursor-pointer bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                <FiX className="mr-2" /> Cancel
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserModal;