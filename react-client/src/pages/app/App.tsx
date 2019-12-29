import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from '../home/Home';
import Register from '../register/Register';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
        <Route exact path="/" component={Home} />
        <Route path="/register" component={Register} />
      </div>
    </BrowserRouter>
  );
};

export default App;
