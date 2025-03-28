import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUsers, addUser, updateUser, deleteUser, logout } from '../store/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiLogOut, 
  FiSearch, 
  FiTrash2, 
  FiEdit,
  FiMenu,
  FiX 
} from 'react-icons/fi';
import UserCard from '../components/UserCard/UserCard';
import UserModal from '../components/UserModal/UserModal';
import Popup from '../components/Popup/Popup';

const BASE_URL = 'https://reqres.in/api/users';

const UserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users.data);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [popup, setPopup] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const observer = useRef();

  // Function to fetch all users from multiple pages at once
  const fetchAllUsers = async () => {
    setLoading(true);
    let allUsers = [];
    let page = 1;

    try {
      while (true) {
        const response = await axios.get(`${BASE_URL}?page=${page}`);
        const newUsers = response.data.data;

        if (newUsers.length === 0) break;   

        allUsers = [...allUsers, ...newUsers];
        page++;
      }

      dispatch(setUsers(allUsers));
      setDisplayedUsers(allUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setPopup({ message: 'Failed to fetch users. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Lazy loading with Intersection Observer
  const lastUserRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const nextUsers = users.slice(
            displayedUsers.length,
            displayedUsers.length + 6
          );
          setDisplayedUsers((prev) => [...prev, ...nextUsers]);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, displayedUsers, users]
  );

  // Initial Fetch on Component Mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
    fetchAllUsers();
  }, [navigate]);

  // Function to delete User with Popup Animation
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        dispatch(deleteUser(id));

        // Remove deleted user from displayed list
        setDisplayedUsers((prev) => prev.filter((user) => user.id !== id));

        setPopup({ message: 'User deleted successfully!', type: 'success' });
      } catch (error) {
        console.error('Failed to delete user:', error);
        setPopup({ message: 'Failed to delete user. Try again.', type: 'error' });
      }
    }
  };

  // Function to add new user
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Function to Edit Existing User
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Function to save User with Popup Animation
  const handleSaveUser = (userData) => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, ...userData };
      dispatch(updateUser(updatedUser));

      // Sync displayedUsers with Redux store to reflect the changes
      setDisplayedUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      setPopup({ message: 'User updated successfully!', type: 'success' });
    } else {
      const newUser = {
        id: Date.now(),
        ...userData,
      };
      dispatch(addUser(newUser));
      setDisplayedUsers((prev) => [...prev, newUser]);
      setPopup({ message: 'User added successfully!', type: 'success' });
    }

    setIsModalOpen(false);
  };

  // Logout Functionality
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Filter Users by Search
  const filteredUsers = displayedUsers.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-gray-100 text-gray-900 antialiased overflow-x-hidden ${isModalOpen ? 'overflow-hidden' : ''}`}>
      <div className={`container mx-auto px-4 py-8 max-w-7xl ${isModalOpen ? 'filter blur-sm pointer-events-none' : ''}`}>
        {/* Mobile Header with Hamburger Menu */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white shadow-md rounded-lg p-4">
          <h1 className="text-2xl font-bold text-blue-600">User Dashboard</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md rounded-lg mb-6"
          >
            <div className="flex flex-col space-y-4 p-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddUser} 
                className="flex items-center justify-center hover:cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
              >
                <FiPlus className="mr-2" /> Expand Team
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout} 
                className="flex items-center justify-center bg-red-600 hover:cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                <FiLogOut className="mr-2" /> Logout
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:block bg-white shadow-md rounded-lg mb-8 p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
              User Management Dashboard
            </h1>

            <div className="flex space-x-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddUser} 
                className="flex items-center bg-emerald-600 text-white px-4 py-2 hover:cursor-pointer rounded-md hover:bg-emerald-700 transition"
              >
                <FiPlus className="mr-2" /> Expand Your Team
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout} 
                className="flex items-center bg-red-600 text-white px-4 py-2 hover:cursor-pointer rounded-md hover:bg-red-700 transition"
              >
                <FiLogOut className="mr-2" /> Logout
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl mx-auto px-4 sm:px-0">
          <input
            type="text"
            placeholder="Search users by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          <FiSearch className="absolute left-6 sm:left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" />
        </div>

        {/* User Grid */}
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0"
          >
            {filteredUsers.map((user, index) => {
              const cardProps = {
                key: user.id,
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.9 },
                transition: { duration: 0.3 }
              };

              if (index === filteredUsers.length - 1) {
                return (
                  <motion.div 
                    ref={lastUserRef} 
                    {...cardProps}
                  >
                    <UserCard
                      {...user}
                      onDelete={() => handleDelete(user.id)}
                      onEdit={() => handleEditUser(user)}
                    />
                  </motion.div>
                );
              } else {
                return (
                  <motion.div 
                    {...cardProps}
                  >
                    <UserCard
                      {...user}
                      onDelete={() => handleDelete(user.id)}
                      onEdit={() => handleEditUser(user)}
                    />
                  </motion.div>
                );
              }
            })}
          </motion.div>
        </AnimatePresence>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center mt-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {/* No Users Message */}
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No users found. Try a different search or add a new user.
          </div>
        )}
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <UserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveUser}
            user={selectedUser}
          />
        </div>
      )}

      {/* Popup Notifications */}
      {popup && <Popup {...popup} onClose={() => setPopup(null)} />}
    </div>
  );
};

export default UserPage;