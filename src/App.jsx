import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen h-full w-full">
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/users' element={<UserPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
