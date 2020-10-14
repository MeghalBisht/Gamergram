import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <main id='toggleTheme' className="dark-theme || light-theme">
      <App />
    </main>
  </React.StrictMode>,
  document.getElementById('root')
);
