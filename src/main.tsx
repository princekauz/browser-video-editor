import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize SharedArrayBuffer for FFmpeg.wasm
if (typeof SharedArrayBuffer === 'undefined') {
  console.warn('SharedArrayBuffer is not available - FFmpeg.wasm may not work properly');
}

// Enable SharedArrayBuffer if not already enabled
if (
  typeof SharedArrayBuffer !== 'undefined' &&
  typeof crossOriginIsolated !== 'undefined' &&
  !crossOriginIsolated
) {
  console.warn('Cross-origin isolation not enabled - SharedArrayBuffer may not work');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
