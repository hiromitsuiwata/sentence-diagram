import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from '../home/Home';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Route exact path="/" component={Home} />
      </div>
    </BrowserRouter>
  );
};

export default App;
