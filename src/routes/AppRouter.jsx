import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import NewJob from "../pages/NewJob";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new-job" element={<NewJob />} />
      </Routes>
    </BrowserRouter>
  );
}