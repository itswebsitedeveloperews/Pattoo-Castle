import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/quattrocento-sans/400.css'
import '@fontsource/quattrocento-sans/700.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
