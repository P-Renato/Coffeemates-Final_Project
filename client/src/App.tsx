import { Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import RegisterPage from "./features/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./features/search/SearchPage";
import MessagePage from "./features/messages/MessagePage";
import ProfilePage from "./features/profile/ProfilePage";
import SettingPage from "./features/settings/SettingPage";
import { AppProvider } from "./context/AppContext";
import LoginPage from "./features/auth/LoginPage";

const App = () => {

  return (
    <AppProvider>
      <Routes>
        {/*  before login */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        {/*  Only see this route after login */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/messages" element={<MessagePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<h1>404: Not Found</h1>} />

      </Routes>
    </AppProvider>
  );
}

export default App
