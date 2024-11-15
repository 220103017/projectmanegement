import React from 'react';
import logo from '../assets/logo.png';

function Header({ onAuthPageOpen }) {
  return (
    <header className="header-container">
      <div className="logo-container">
        <img src={logo} alt="Mental Health Awareness Logo" className="logo-image" />
      </div>
      <div className="button-container">
        <button className="signup-button" onClick={() => onAuthPageOpen('signUp')}>
          Sign Up
        </button>
        <button className="login-button" onClick={() => onAuthPageOpen('signIn')}>
          Sign In
        </button>
      </div>
    </header>
  );
}

export default Header;