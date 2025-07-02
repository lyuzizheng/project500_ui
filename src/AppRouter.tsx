import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPageNew from "./admin/AdminPageNew";
import HomePage from "./HomePage.tsx";
import App from "./user/App.tsx";
import Credit from "./user/Credit.tsx";

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
