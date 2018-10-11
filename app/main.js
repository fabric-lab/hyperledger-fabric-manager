import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';


let history = createBrowserHistory();

ReactDOM.render(<HashRouter >{routes}</HashRouter>, document.getElementById('app'));