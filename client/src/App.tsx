import Navbar from '../components/Navbar'

export default function App() {
  const user = {
    name: 'Marie',
    photoURL: 'https://example.com/avatar.jpg',
  }

  return (
    <div className="flex">
      {/* ← 左サイドバー */}
      <Navbar user={user} />

      {/* ← メインエリア */}
      <main className="flex-1 bg-[#f8f8f8] min-h-screen p-8">
        <h1 className="text-2xl font-bold">Welcome to Coffeemates ☕️</h1>
      </main>
    </div>
  )
}
