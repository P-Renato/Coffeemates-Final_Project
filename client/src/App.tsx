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
    <div className="flex">
      <Navbar user={user} />

      <main className="flex-1 bg-[#f8f8f8] min-h-screen p-8">
        <Settings />
      </main>
    </div>
  );
}

