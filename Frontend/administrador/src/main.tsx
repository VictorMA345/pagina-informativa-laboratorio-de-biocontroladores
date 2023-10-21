import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './MainRoutes.tsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.tsx'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>,
)
