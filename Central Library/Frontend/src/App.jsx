import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { Homepage } from './components/Homepage';
import { MapPage } from './components/MapPage';
import { ProfilePage } from './components/ProfilePage';
import { BookPage } from './components/BookPage';
import { SearchPage } from './components/SearchPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/books" element={<BookPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};

export default App;