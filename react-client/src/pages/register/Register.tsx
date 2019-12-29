import React from 'react';
import { Link } from 'react-router-dom';
import RegisterHeader from './header/RegisterHeader';

import styles from './Register.module.css';

const Register = () => {
  return (
    <div>
      <RegisterHeader></RegisterHeader>
      <div className={styles.main}>
        <div className={styles.register_fields}>
          <input type="text" className={styles.editor_title} placeholder="Title"></input>
          <textarea className={styles.editor_text} placeholder="Your text here"></textarea>
          <input type="text" className={styles.editor_url} placeholder="URL"></input>
          <div className={styles.button_area}>
            <Link to="/">
              <div className={styles.cancel_button}>Cancel</div>
            </Link>
            <div className={styles.post_button}>Post</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
