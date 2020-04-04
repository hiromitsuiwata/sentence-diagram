import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilRuler, faExternalLinkAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './Card.module.css';

interface Props {
  id: number;
  title: string;
  text: string;
  url: string;
  openModalHandler: (id: number, title: string, text: string) => void;
  deleteCardHandler: (id: number) => void;
}
interface State {}

class Card extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.showDiagram = this.showDiagram.bind(this);
  }

  showDiagram(e: React.FormEvent): void {
    e.preventDefault();
    this.props.openModalHandler(this.props.id, this.props.title, this.props.text);
  }

  delete(e: React.FormEvent): void {
    e.preventDefault();
    this.props.deleteCardHandler(this.props.id);
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
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          </div>
          <div className={styles.diagram}>
            <a href="/" onClick={this.showDiagram}>
              diagram&nbsp;
              <FontAwesomeIcon icon={faPencilRuler} />
            </a>
          </div>
          <div className={styles.trash}>
            <a href="/" onClick={this.delete}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
