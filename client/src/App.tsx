import { Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./features/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./features/search/SearchPage";
import MessagePage from "./features/messages/MessagePage";
import ProfilePage from "./features/profile/ProfilePage";
import SettingPage from "./features/settings/SettingPage";

const LoginPage = () => <div>Login Page Coming Soon!</div>;
// const LoginPage = () => <div>Login Page Coming Soon!</div>;
// const FeedPage = () => <div>Social Feed</div>;

const App = () => {
  return (
    <AuthProvider>
      <Routes>

        {/* Routes without sidebar - after activate login authentication will open this route */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/*  Routes WITH sidebar */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/messages" element={<MessagePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingPage />} />
        </Route>

        {/* <Route element={<MainLayout />}>
        </Route> */}

        {/* Catch-all */}
        <Route path="*" element={<h1>404: Not Found</h1>} />
      </Routes>

    </AuthProvider>
  );
};

export default App;
