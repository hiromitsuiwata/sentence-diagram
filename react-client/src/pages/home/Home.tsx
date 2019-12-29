import React from 'react';
import HomeHeader from './header/HomeHeader';
import logo from './logo.svg';
import './Home.css';

const Home = () => {
  return (
    <div className="Home">
      <HomeHeader />
      <img src={logo} className="Home-logo" alt="logo" />
      <p>
        Edit <code>src/Home.tsx</code> and save to reload.
      </p>
      <a className="Home-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
        Learn React
      </a>
    </div>
  );
};

export default Home;
