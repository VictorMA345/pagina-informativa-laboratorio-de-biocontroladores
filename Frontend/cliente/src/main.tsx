import React from 'react'
import ReactDOM from 'react-dom/client'
import MainRoutes from './MainRoutes.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import './hooks/i18n.js';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  </React.StrictMode>,
)
