import React from 'react';
import TextPath from '../../diagram/svg/TextPath';

const MyCardText = () => {
  return (
    <>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <TextPath x={10} y={20} text="example" direction="" />
      </svg>
    </>
  );
};

export default MyCardText;
