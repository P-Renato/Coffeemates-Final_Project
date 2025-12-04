import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from './context/AuthProvider';
import { AppProvider } from "./context/LocationPostContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./features/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./features/search/SearchPage";
import ChatPage from "./features/Chat/ChatPage";
import ProfilePage from "./features/profile/ProfilePage";
import SettingPage from "./features/settings/SettingPage";
import OAuthSuccess from "./pages/OAuthSuccess";
import LoginPage from "./features/auth/LoginPage";
import AdminPage from "./features/auth/AdminPage"
import EditProfil from "./features/profile/EditProfile";


const App = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Public routes - accessible without authentication */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
          </Route>

          {/* OAuth success route */}
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* Protected routes - ONLY accessible when authenticated */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfil />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/edit-profile" element={<EditProfil />} />
          </Route>

          {/* Admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<h1>404: Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;