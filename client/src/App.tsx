import { Routes, Route } from 'react-router-dom';
import RegisterPage from '../features/auth/RegisterPage';


const LoginPage = () => <div>Login Page Coming Soon!</div>;
const FeedPage = () => <div>Social Feed</div>;

const App = () => {
  return (
    <div className="App">
      <Routes>
       
        <Route path="/signup" element={<RegisterPage />} /> 

        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<FeedPage />} /> 

        <Route path="*" element={<h1>404: Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;