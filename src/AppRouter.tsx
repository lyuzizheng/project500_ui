import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import Credit from "./Credit.tsx";
import { AdminPage } from "./admin";
import AdminPageNew from "./admin/AdminPageNew";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/admin/hf7u8b827/:userId" element={<AdminPage />} />
        <Route path="/admin/new/hf7u8b827/:userId" element={<AdminPageNew />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
