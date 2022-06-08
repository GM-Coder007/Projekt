import { BrowserRouter, Route, Routes } from "react-router-dom";
import FrontPage from "./pages";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import LogoutPage from "./pages/logout";
import DashboardPage from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// <Route path="/post/:postId" element={<PostPage />} />
