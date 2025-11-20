import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
//import 'leaflet/dist/leaflet.css';   // map

// Import the BrowserRouter
import { BrowserRouter } from 'react-router-dom'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Use BrowserRouter to enable routing across the app */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);