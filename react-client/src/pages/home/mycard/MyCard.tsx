import React from 'react';
import MyCardText from './text/MyCardText';
import styles from '../card/Card.module.css';

const MyCard: React.FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.id}>#0</div>
      <div className={styles.title}>Lorem ipsum</div>
      <div className={styles.text}>
        <MyCardText></MyCardText>
      </div>
      <div className={styles.operation}>
        <div className={styles.id}></div>
        <div className={styles.link}>
          <a href="url">link</a>
        </div>
        <div className={styles.diagram}>
          <a href="url">diagram</a>
        </div>
      </div>
    </div>
  );
};

export default MyCard;
