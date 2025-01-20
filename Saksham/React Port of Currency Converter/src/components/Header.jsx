import React from 'react';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  return (
    <header>
      <h1>Currency Converter</h1>
      <ThemeToggle />
    </header>
  );
};

export default Header;
