import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import styles from './Diagram.module.css';

interface Props {
  id: number;
  title: string;
  text: string;
  closeModalHandler: () => void;
}

interface State {}

class Diagram extends React.Component<Props, State> {
  render(): JSX.Element {
    return (
      <div className={styles.overlay}>
        <div className={styles.window}>
          <div className={styles.title}>{this.props.title}</div>
          <div className={styles.text}>
            <div>{this.props.text}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 900 500"
              width="900"
              height="500"
            ></svg>
          </div>
          <div className={styles.operation}>
            <div className={styles.operation_close}>
              <a href="#top" onClick={this.props.closeModalHandler}>
                close
                <FontAwesomeIcon icon={faWindowClose} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Diagram;
