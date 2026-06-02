import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#111118',
          color: '#e8e8f0',
          border: '1px solid #2a2a3a',
          borderRadius: '10px',
          fontSize: '0.875rem',
        },
        success: { iconTheme: { primary: '#00ff88', secondary: '#000' } },
        error: { iconTheme: { primary: '#ff4466', secondary: '#000' } },
      }}
    />
  </StrictMode>
)
