import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import styles from './RegisterHeader.module.css';

const RegisterHeader = () => {
  return (
    <div className={styles.header}>
      <Link to="/">
        <div className={styles.back_button}>
          <FontAwesomeIcon icon={faArrowLeft} className={styles.center} />
        </div>
      </Link>
    </div>
  );
};

export default RegisterHeader;
