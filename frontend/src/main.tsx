import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

// Safe runtime helper tracking utility
// Instead of mutating import.meta, components can check this global helper if needed, 
// or read directly from localStorage.
export const isDemoModeActive = () => {
  return import.meta.env.VITE_USE_DEMO_MODE === 'true' || localStorage.getItem('nova_local_demo_override') === 'true';
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)