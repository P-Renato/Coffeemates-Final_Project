import { NavLink } from "react-router-dom"

interface NavbarProps {
  user?: {
    name: string
    photoURL?: string
  }
}

export default function Navbar({ user }: NavbarProps) {
  const navItems = [
    { label: "Home", icon: "🏠", to: "/" },
    { label: "Search", icon: "🔍", to: "/search" },
    { label: "Messages", icon: "💬", to: "/messages" },
    { label: "Profile", icon: "👤", to: "/profile" },
    { label: "Settings", icon: "⚙️", to: "/settings" },
  ]

  return (
    <aside className="w-[244px] min-h-screen bg-white flex flex-col items-center border-r border-greyline px-sidebarX py-sidebarY font-base text-text">
      {/* Logo */}
      <h1 className="text-xl font-bold mb-6">Coffeemates</h1>

      {/* No login */}
      {!user && (
        <div className="flex flex-col items-center mt-10 w-full">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-500">
                        👤
                    </div>
                    <p className="mt-2 text-profile font-medium text-text">Welcome!</p>
                    <div className="w-full border-t border-greyline mt-3" />
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
                        Hello <span className="font-bold text-2xl">{user.name}</span>
                    </p>

                    {/* holizontal */}
                    <div className="w-full border-t border-greyline mt-3 mb-4"></div>

                    {/* Notification */}
                    <div className="w-full bg-[#FFFDEE] rounded-md p-4 mb-10 text-sm">
                        <div className="flex items-center gap-2 font-semibold">
                            <span>🔔</span> Notification
                        </div>

                        <div className="mt-2 text-xs text-gray-600 border-t border-greyline pt-2">
                    <p>@coffeeelena commented on your post</p>
                    <p>@flatwhitelover commented on your post</p>
                  </div>
                </div>
            </div>
          )}

      {/* nav (always shown) */}
      <nav className="w-full flex flex-col gap-3 mt-8">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 py-2 px-2 rounded-md text-profile transition-all duration-200 ease-in-out",
                isActive ? "font-semibold bg-gray-100" : "hover:font-semibold",
              ].join(" ")
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
