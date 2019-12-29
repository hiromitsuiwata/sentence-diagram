import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import './HomeHeader.css';

const HomeHeader = () => {
  return (
    <div className="header">
      <div className="logo">
        <div className="logo1">sentence</div>
        <div className="logo2">diagram</div>
      </div>

      <div className="search-frame">
        <input id="searchInput" v-model="searchWord" type="text" className="textbox" />
        <button className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <div className="user-button">
        <FontAwesomeIcon icon={faUser} className="center" />
      </div>

      <div>
        <Link to="/register">
          <div className="create-button">
            <FontAwesomeIcon icon={faPencilAlt} className="center" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;
