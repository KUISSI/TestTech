import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithProvider from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AppWithProvider />
  </React.StrictMode>
);
