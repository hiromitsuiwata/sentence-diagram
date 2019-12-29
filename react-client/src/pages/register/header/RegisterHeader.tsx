import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import './RegisterHeader.css';

const RegisterHeader = () => {
  return (
    <div className="header">
      <Link to="/">
        <div className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} className="center" />
        </div>
      </Link>
    </div>
  );
};

export default RegisterHeader;
