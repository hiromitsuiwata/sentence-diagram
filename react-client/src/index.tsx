import React from 'react';
import ReactDOM from 'react-dom';
//import { library } from '@fortawesome/fontawesome-svg-core';
//import { fab } from '@fortawesome/free-brands-svg-icons';
//import { fas } from '@fortawesome/free-solid-svg-icons';
//import { far } from '@fortawesome/free-regular-svg-icons';

import './index.css';
import App from './pages/app/App';
//import * as serviceWorker from './serviceWorker';

//library.add(fab, fas, far); //他のコンポーネントから簡単に呼び出せるようにするための登録処理

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
