import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { loginSuccess } from '../store/store';
import { KeyRound, Mail, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email,
        password
      });

      const token = response.data.token;

      localStorage.setItem('token', token);
      dispatch(loginSuccess(token));
      setSuccess(true);

      setTimeout(() => {
        navigate('/users');
      }, 1500);

    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        {/* Decorative Background Shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-52 h-52 bg-cyan-100 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="p-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text bg mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm">Enter your credentials to access your account</p>
          </div>

          {error && (
            <motion.div 
              className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-red-200 text-red-600 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="font-bold">!</span>
              </div>
              <p className="text-sm flex-grow">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-6 flex items-center space-x-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-green-200 text-green-600 rounded-full w-8 h-8 flex items-center justify-center">
                <span>✓</span>
              </div>
              <p className="text-sm flex-grow">Login Successful! Redirecting...</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-cyan-500  text-m font-medium mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  placeholder="abc@gmail.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-cyan-500 text-m font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="w-5 h-5 text-blue-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg 
              hover:from-blue-700 hover:to-cyan-600 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition duration-300 ease-in-out transform 
              hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed 
              flex items-center justify-center hover:cursor-pointer space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;