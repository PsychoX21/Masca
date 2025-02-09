import React from 'react';
import './SignupPage.css';
import { Intro, ProfilePhoto } from "./Blocks.jsx"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";


const SignUp = () => {
  const [slide, setSlide] = useState(0);
  const [formData, setFormData] = useState({
    profilePhoto: null,
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    referral: "",
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    dob: '',
  });

  const [visible, setVisible] = useState(false);

  const validateForm = () => {
    const { email, password, name, phone, dob } = formData;
    let formErrors = { email: '', password: '', name: '', phone: '', dob: '' };
    let isValid = true;

    if (slide === 0) {
      if (!name.trim()) {
        formErrors.name = 'Name cannot be empty';
        isValid = false;
      }

      if (!email.endsWith('@iitb.ac.in')) {
        formErrors.email = 'Invalid LDAP email';
        isValid = false;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^~`<>;:/?])[A-Za-z\d@$!%*?&#^~`<>;:/?]{8,}$/;

      if (!passwordRegex.test(password)) {
        formErrors.password =
          'Password must have at least 8 characters, 1 upper, 1 lower, 1 digit & 1 special';
        isValid = false;
      }
    };


    if (slide === 1) {
      const currentDate = new Date();
      const dob = new Date(formData.dob);
      
      if (!dob || isNaN(dob.getTime()) || dob > currentDate || dob < new Date('1900-01-01')) {
        formErrors.dob = 'Date of Birth is invalid';
        isValid = false;
      }

      if (phone.length !== 10 || isNaN(phone)) {
        formErrors.phone = 'Invalid Phone Number';
        isValid = false;
      }
    };

    setErrors(formErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleNext = () => {
    if (slide === 0) {
      if (!validateForm()) {
        console.log("Form is not valid");
        return;
      }
      else {
        setSlide((prev) => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    setSlide((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form is not valid");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("referral", formData.referral);

    if (formData.profilePhoto) {
      formDataToSend.append("profile_photo", formData.profilePhoto);
    }
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/register/", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
        },
      });
      
      alert("Registration successful!");
      console.log(response.data);
      window.location.href = "/login";
    } catch (error) {
      alert("Registration failed!");
      console.error(error);
    }
  };

  return (
      <div className="form-container">
        <AnimatePresence mode="wait">
          {slide === 0 && (
            <motion.div
              key="slide1"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="form-step"
            >
              <h2 className="heading">Step 1</h2>
              <div className="input-group">
                <ProfilePhoto
                  profilePhoto={formData.profilePhoto}
                  setProfilePhoto={(photo) => setFormData({ ...formData, profilePhoto: photo })}
                />
              </div>
              <div className="input-group">
                <label className="label required">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder='Enter your name'
                  onChange={handleInputChange}
                  className="input-field"
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>
              <div className="input-group">
                <label className="label required">LDAP ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder='Enter your email'
                  onChange={handleInputChange}
                  className="input-field"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              <div className="input-group">
                <label className="label required">Password</label>
                <div className='password-wrapper'>
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder='Create a password'
                    onChange={handleInputChange}
                    className="input-field password"
                  />
                  <span className="password-toggle" onClick={() => setVisible(!visible)}>
                  {visible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              <button
                onClick={handleNext}
                className="btn btn-next"
              >
                Next
              </button>
            </motion.div>
          )}

          {slide === 1 && (
            <motion.div
              key="slide2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="form-step"
            >
              <h2 className="heading">Step 2</h2>
              <div className="input-group">
                <label className="label required">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="input-field"
                />
                {errors.dob && <div className="error-message">{errors.dob}</div>}
              </div>
              <div className="input-group">
                <label className="label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label className="label required">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  placeholder='Enter your phone number without +91'
                  onChange={handleInputChange}
                  className="input-field"
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>
              <div className="input-group">
                <label className="label">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  placeholder='Enter your address like room number, hostel number, etc.'
                  onChange={handleInputChange}
                  className="input-field"
                  rows="2"
                ></textarea>
              </div>
              <div className="input-group">
                <label className="label">Referral Code</label>
                <input
                  type="text"
                  name="referral"
                  value={formData.referral}
                  placeholder='For Admin Access'
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="button-group">
                <button
                  onClick={handlePrev}
                  className="btn btn-back"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-submit"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <a href="/login">Already have an account? Login</a>
      </div>
  );
};

const SignupPage = () => {
  return (
    <div className='auth-root-style'>
      <div className="signup-main">
        <img
          src="src/assets/iitblogo.png"
          alt="Library"
          className="lib-image-signup"
        />
        <div className='left'>
          <Intro height="60%" width="95%" margin="0px"/>
        </div>
        <SignUp />
      </div>
    </div>  
  );
};

export default SignupPage;
