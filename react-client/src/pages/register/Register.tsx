import React from 'react';
import { Link } from 'react-router-dom';
import RegisterHeader from './header/RegisterHeader';

import './Register.css';

const Register = () => {
  return (
    <div>
      <RegisterHeader></RegisterHeader>
      <div className="main">
        <div className="register-fields">
          <input type="text" className="editor editor-title" placeholder="Title"></input>
          <textarea className="editor editor-text" placeholder="Your text here"></textarea>
          <input type="text" className="editor editor-url" placeholder="URL"></input>
          <div className="button-area">
            <Link to="/">
              <div className="cancel-button">Cancel</div>
            </Link>
            <div className="post-button">Post</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
