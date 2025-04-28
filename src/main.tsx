import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { Route } from 'react-router'
import { Routes } from 'react-router'
import './index.css'
import CountSleep from './pages/HomePage/HomePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<CountSleep />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
