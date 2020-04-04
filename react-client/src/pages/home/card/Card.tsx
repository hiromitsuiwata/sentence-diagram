import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilRuler } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import styles from './Card.module.css';

interface Props {
  id: number;
  title: string;
  text: string;
  url: string;
  openModalHandler: (id: number, title: string, text: string) => void;
}
interface State {}

class Card extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.drop = this.drop.bind(this);
  }

  showDiagram = (e: any) => {
    e.preventDefault();
    this.props.openModalHandler(this.props.id, this.props.title, this.props.text);
  };

  drop(e: React.FormEvent): void {
    e.preventDefault();
    console.log(this.props.id);
    axios
      .delete('http://localhost:9080/sentence-diagram-web/api/sentences/' + this.props.id)
      .then((response) => {
        console.log({
          response: response,
        });
      })
      .catch((error) => {
        console.log({
          error: error,
        });
      });
  }

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
          <div className={styles.garbage}>
            <a href="#top" onClick={this.drop}>
              drop
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
