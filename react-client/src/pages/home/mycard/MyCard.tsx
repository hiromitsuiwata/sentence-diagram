import React from 'react';
import MyCardText from './text/MyCardText';

const MyCard = () => {
  return (
    <div className="card">
      <div className="card-id">#0</div>
      <div className="card-title">Lorem ipsum</div>
      <div className="card-text">
        <MyCardText></MyCardText>
      </div>
      <div className="card-operation">
        <div className="card-id"></div>
        <div className="card-link">
          <a href="url">link</a>
        </div>
        <div className="card-diagram">
          <a href="url">diagram</a>
        </div>
      </div>
    </div>
  );
};

export default MyCard;
