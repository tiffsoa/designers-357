import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import { Goals } from "./pages/Goals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/register" element={<RegisterPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
