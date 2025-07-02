import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import HomePage from "./HomePage.tsx";
import Credit from "./Credit.tsx";
import AdminPageNew from "./admin/AdminPageNew";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:userId/:apiKey" element={<App />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/admin/hf7u8b827/:userId" element={<AdminPageNew />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
