import React, { useState } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark-mode');
    setIsLight(!isLight);
  };

  return (
    <button id="themetoggle" className={isLight ? 'light' : ''} onClick={toggleTheme}></button>
  );
};

export default ThemeToggle;
