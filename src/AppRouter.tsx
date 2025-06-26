import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import { AdminPage } from './admin'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/hf7u8b827/L:userId" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter