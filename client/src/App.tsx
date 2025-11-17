import { Routes, Route } from 'react-router-dom';
import RegisterPage from './features/auth/RegisterPage';
import Home from './pages/HomePage';
import SearchPage from './features/search/SearchPage';
import MessagePage from './features/messages/MessagePage';
import ProfilePage from './features/profile/ProfilePage';
import SettingPage from './features/settings/SettingPage';
import OAuthSuccess from './pages/OAuthSuccess';


const LoginPage = () => <div>Login Page Coming Soon!</div>;
// const FeedPage = () => <div>Social Feed</div>;

const App = () => {
  return (
    <div className="App">
      <Routes>
       
        <Route path="/signup" element={<RegisterPage />} /> 

        <Route path="/login" element={<LoginPage />} />

        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route path="/" element={<Home />} /> 

        <Route path="/search" element={<SearchPage />} />

        <Route path="/messages" element={<MessagePage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/settings" element={<SettingPage />} />

        <Route path="*" element={<h1>404: Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;