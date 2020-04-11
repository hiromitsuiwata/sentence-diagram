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

const Card: React.FC<Props> = (props) => {
  function showDiagram(e: React.FormEvent): void {
    e.preventDefault();
    props.openModalHandler(props.id, props.title, props.text);
  }

  function deleteCard(e: React.FormEvent): void {
    e.preventDefault();
    props.deleteCardHandler(props.id);
  }

  return (
    <div className={styles.card}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.text}>{props.text}</div>
      <div className={styles.operation}>
        <div className={styles.id}>#{props.id}</div>
        <div className={styles.link}>
          <a target="_blank" rel="noopener noreferrer" href={props.url}>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </div>
        <div className={styles.diagram}>
          <a href="/" onClick={showDiagram}>
            diagram&nbsp;
            <FontAwesomeIcon icon={faPencilRuler} />
          </a>
        </div>
        <div className={styles.trash}>
          <a href="/" onClick={deleteCard}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
