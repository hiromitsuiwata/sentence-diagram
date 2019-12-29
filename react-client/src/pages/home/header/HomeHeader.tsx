import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './HomeHeader.module.css';

const HomeHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logo1}>sentence</div>
        <div className={styles.logo2}>diagram</div>
      </div>

      <div className={styles.search_frame}>
        <input id="searchInput" type="text" className={styles.textbox} />
        <button className={styles.search_button}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <div className={styles.user_button}>
        <FontAwesomeIcon icon={faUser} className={styles.center} />
      </div>

      <div>
        <Link to="/register">
          <div className={styles.create_button}>
            <FontAwesomeIcon icon={faPencilAlt} className={styles.center} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;
