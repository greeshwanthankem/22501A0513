import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Log } from './utils/logger';

const root = ReactDOM.createRoot(document.getElementById('root'));

Log('frontend', 'info', 'component', 'React app starting up');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
