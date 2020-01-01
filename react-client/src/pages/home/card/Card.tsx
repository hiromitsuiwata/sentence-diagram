import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilRuler } from '@fortawesome/free-solid-svg-icons';
import styles from './Card.module.css';

interface Props {
  id: number;
  title: string;
  text: string;
  url: string;
}
interface State {}

class Card extends React.Component<Props, State> {
  showDiagram = () => {
    alert('clicked!');
  };

  render() {
    return (
      <div className={styles.card}>
        <div className={styles.title}>{this.props.title}</div>
        <div className={styles.text}>{this.props.text}</div>
        <div className={styles.operation}>
          <div className={styles.id}>#{this.props.id}</div>
          <div className={styles.link}>
            <a target="_blank" rel="noopener noreferrer" href={this.props.url}>
              link
            </a>
          </div>
          <div className={styles.diagram}>
            <a href="#top" onClick={this.showDiagram}>
              diagram
              <FontAwesomeIcon icon={faPencilRuler} />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
