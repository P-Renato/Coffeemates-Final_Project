import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { HashRouter } from 'react-router-dom'; // ← CHANGE TO HashRouter
import './index.css';
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter> {/* ← USE HashRouter */}
      <App />
    </HashRouter>
  </React.StrictMode>,
);