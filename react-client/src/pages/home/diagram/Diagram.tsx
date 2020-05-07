import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import styles from './Diagram.module.css';
import axios from 'axios';

interface Props {
  id: number;
  title: string;
  text: string;
  closeModalHandler: () => void;
}

const Diagram: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    axios.put('/api/sentences/' + props.id + '/diagram').then((response) => {
      console.log(response.data[0]);
    });
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.window}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.text}>
          <div>{props.text}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 900 500"
            width="900"
            height="500"
          ></svg>
        </div>
        <div className={styles.operation}>
          <div className={styles.operation_close}>
            <a href="#top" onClick={props.closeModalHandler}>
              close
              <FontAwesomeIcon icon={faWindowClose} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagram;
