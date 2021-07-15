import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import lodash from 'lodash';

import styles from './HomeHeader.module.css';

interface Props {
  searchHander: (keyword: string) => void;
  openRegistrationHandler: () => void;
  loginHandler: (user: string, password: string) => void;
}

const HomeHeader: React.FC<Props> = (props) => {
  const debounceInputSearch = lodash.debounce(() => {
    const input = document.getElementById('searchInput');
    if (input && input instanceof HTMLInputElement) {
      props.searchHander(input.value);
    }
  }, 500);

  const login = () => {
    // TODO ユーザーの入力を使う
    props.loginHandler('myuser', 'mypassword');
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logo1}>sentence</div>
        <div className={styles.logo2}>diagram</div>
      </div>

      <div className={styles.search_frame}>
        <input
          id="searchInput"
          type="text"
          className={styles.textbox}
          onInput={debounceInputSearch}
        />
        <button className={styles.search_button} name="search">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <div className={styles.user_button} onClick={login}>
        <FontAwesomeIcon icon={faUser} className={styles.center} />
      </div>

      <div>
        <div className={styles.create_button} onClick={props.openRegistrationHandler}>
          <FontAwesomeIcon icon={faPencilAlt} className={styles.center} />
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
