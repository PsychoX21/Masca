import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import { Intro } from "./Blocks.jsx"

const AuthPage = () => {
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      navigate("/home"); // Redirect if user exists
    } else {
      setLoaded(true); // Triggers effect after mount
    }
  }, [navigate]);

  return (
    <div className='auth-root-style'>
      <Intro height="85%" width="50%" margin="20px"/>

      <div className='right'>
        <img
        src="src/assets/iitblogo.png"
        alt="Library"
        className="auth-lib-image"
        />
        
        <div className={`auth-main ${loaded ? "fade-in" : ""}`}>

          <h1>Welcome</h1>
          
          <div className="auth-container">
            <div className="profile">
              <img
                src="src/assets/profile.jpg"
                alt="Profile"
                className="auth-profpic"
              />
            </div>
            <div className="button-container">
              <button onClick={() => navigate('/login')} className="auth-button">
                Login
              </button>
              <button onClick={() => navigate('/signup')} className="auth-button">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
