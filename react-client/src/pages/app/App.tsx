import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from '../home/Home';
import Register from '../register/Register';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/register" component={Register} />
      </div>
    </BrowserRouter>
  );
};

export default App;
