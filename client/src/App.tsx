import Navbar from '../components/Navbar';
import Settings from '../pages/Settings';
import './index.css';

export default function App() {
  const user = {
    name: 'Marie',
    photoURL: 'https://example.com/avatar.jpg',
  };

  return (
    <div className="flex">
      <Navbar user={user} />

      <main className="flex-1 bg-[#f8f8f8] min-h-screen p-8">
        <Settings />
      </main>
    </div>
  );
}

