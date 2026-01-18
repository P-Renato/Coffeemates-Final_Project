
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'leaflet/dist/leaflet.css';   // map

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Use BrowserRouter to enable routing across the app */}
      <App />
  </React.StrictMode>,
);