import React from 'react';
import HomeHeader from './header/HomeHeader';
import MyCard from './mycard/MyCard';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.Home}>
      <HomeHeader />
      <div className={styles.main}>
        <div className={styles.columns}>
          <MyCard />
          <MyCard />
          <MyCard />
          <MyCard />
          <MyCard />
          <MyCard />
          <MyCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
