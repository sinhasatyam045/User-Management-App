import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const UserCard = React.forwardRef(({ id, first_name, last_name, email, avatar, onEdit, onDelete }, ref) => {
  return (
    <motion.div
      ref={ref}
      className="group"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        {/* User Info Section */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <img
              src={avatar}
              alt={`${first_name} ${last_name}`}
              className="w-28 h-28 rounded-full object-cover border-4 border-emerald-100 shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            
          </div>

          {/* User Details */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text mb-1">
              {first_name} {last_name}
            </h2>
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {email}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 w-full">
            <button
              onClick={() => onEdit(id)}
              className="flex-1 flex items-center justify-center hover: cursor-pointer bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50"
            >
              <FiEdit className="mr-2" /> Edit
            </button>

            <button
              onClick={() => onDelete(id)}
              className="flex-1 flex items-center justify-center hover: cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            >
              <FiTrash2 className="mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

UserCard.displayName = 'UserCard';

export default UserCard;