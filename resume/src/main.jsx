import React from 'react'
import ReactDom from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './welcome.jsx'
import Login from './login.jsx'
import Resume from './resume.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
