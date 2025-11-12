import React from 'react'

interface NavbarProps {
  user?: {
    name: string
    photoURL?: string
  }
}

export default function Navbar({ user }: NavbarProps) {
  const navItems = [
    { label: 'Home', icon: '🏠' },
    { label: 'Search', icon: '🔍' },
    { label: 'Messages', icon: '💬' },
    { label: 'Post', icon: '➕' },
    { label: 'Profile', icon: '👤' },
    { label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside
      className="w-[244px] min-h-screen bg-white flex flex-col items-center border-r border-line px-sidebarX py-sidebarY font-base text-text"
    >
      {/* Logo */}
      <h1 className="text-xl font-bold mb-6">Coffeemates</h1>

      {/* No login */}
      {!user && (
        <div className="flex flex-col items-center mt-10">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-500">
            👤
          </div>
          <p className="mt-2 text-profile font-medium text-text">Welcome!</p>
          <div className="w-full border-t border-line mt-3" />
        </div>
      )}

      {/* Login */}
      {user && (
        <div className="flex flex-col items-center w-full">
          <img
            src={user.photoURL || '/default-avatar.png'}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <p className="mt-3 text-profile">
            Hello <span className="font-bold">{user.name}</span>
          </p>
          <div className="w-full border-t border-line mt-3 mb-4" />

          {/* Notification */}
          <div className="w-full bg-[#FFFDEE] rounded-md p-3 mb-6 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <span>🔔</span> Notification
            </div>
            <div className="mt-2 text-xs text-gray-600 border-t border-line pt-2">
              <p>@coffeeelena commented on your post</p>
              <p>@flatwhitelover commented on your post</p>
            </div>
          </div>

          {/* nav */}
          <nav className="w-full flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-3 py-2 px-2 rounded-md text-profile hover:bg-gray-100 transition"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </aside>
  )
}
