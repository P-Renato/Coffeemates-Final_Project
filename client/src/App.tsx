import { Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import RegisterPage from "./features/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./features/search/SearchPage";
import MessagePage from "./features/messages/MessagePage";
import ProfilePage from "./features/profile/ProfilePage";
import SettingPage from "./features/settings/SettingPage";

const LoginPage = () => <div>Login Page Coming Soon!</div>;

const App = () => {
  return (
    <Routes>

      {/*  Routes without sidebar - after activate login authentication will open this route
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
       */}

      {/*  Routes WITH sidebar */}
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
  );
};

export default App;
