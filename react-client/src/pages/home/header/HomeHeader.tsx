import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import lodash from 'lodash';

import styles from './HomeHeader.module.css';

interface Props {
  searchHander: (keyword: string) => void;
}

interface State {}

class HomeHeader extends React.Component<Props, State> {
  render(): JSX.Element {
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
            onInput={this.debounceInputSearch}
          />
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
  }

  debounceInputSearch = lodash.debounce((e) => {
    const input = document.getElementById('searchInput');
    if (input && input instanceof HTMLInputElement) {
      this.props.searchHander(input.value);
    }
  }, 500);
}

export default HomeHeader;
