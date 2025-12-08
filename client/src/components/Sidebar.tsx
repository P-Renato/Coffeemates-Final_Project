import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/LocationPostContext";
import { useAuth } from "../hooks/useAuth";
import '../styles/_global.css';
import styles from './sidebar.module.css';


export default function Sidebar() {
    const { postPopup, setPostPopup } = useAppContext();
    const { user, logout } = useAuth();

    const navItems = [
        { label: 'Home', icon: '🏠', url: '/home' },
        { label: 'Search', icon: '🔍', url: '/search' },
        { label: 'Messages', icon: '💬', url: '/chat' },
        { label: 'Post', icon: '➕' },
        { label: 'Profile', icon: '👤', url: '/profile' },
        {/* label: 'Settings', icon: '⚙️', url: '/settings' */},
    ];

    return (
        <aside className="w-[244px] min-h-screen bg-white flex flex-col items-center border-r border-greyline px-sidebarX py-sidebarY font-base text-text">
            {/* Logo */}
            <h1 className={`${styles.courier} text-xl font-bold mb-6`}>Coffeemates</h1>

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
                        src={user.photoURL || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'}
                        alt={user.username}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <p className={`${styles.roboto} mt-3 text-profile`}>
                        Hello <span className={`${styles.roboto} font-bold text-2xl`}>{user.username}</span>
                        <button className="cursor-pointer w-full bg-blue-400 text-white"  onClick={() => logout()}>Logout</button>
                    </p>

                    {/* horizontal */}
                    <div className="w-full border-t border-greyline mt-3 mb-4"></div>

                    {/* Notification */}
                    <div className="w-[14em] bg-[#FFFDEE] rounded-md  p-4 mb-10 text-sm">
                        <div className="flex items-center gap-2 font-semibold">
                            <span>🔔</span> Notification
                        </div>
                        <div className="mt-2 text-xs text-gray-600 border-t border-greyline pt-2">
                            <p>@coffeeelena commented on your post</p>
                            <p>@flatwhitelover commented on your post</p>
                        </div>
                    </div>

                    {/* nav */}
                    <nav className="w-full flex flex-col gap-3">
                        {navItems.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 py-2 px-2 rounded-md text-profile transition-all duration-200 ease-in-out hover:font-semibold cursor-pointer"
                                onClick={() => {
                                    if (item.label === "Post") setPostPopup(!postPopup);
                                }}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.url ? (
                                    <NavLink to={item.url}>{item.label}</NavLink>
                                ) : (
                                    <span>{item.label}</span>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            )}
        </aside>
    );
}
