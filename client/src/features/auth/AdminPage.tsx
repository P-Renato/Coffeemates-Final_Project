import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, LayoutDashboard, Users, MessageSquare, AlertTriangle, 
  Trash2, CheckCircle, ChevronDown, ChevronUp, Search, 
  SlidersHorizontal, UserCircle, Settings 
} from 'lucide-react';
import { getAllUsers, deleteUserById } from '../../api/adminApi';



interface User {
  _id?: string;
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  profileImage?: string;
  avatar?: string;
  status?: string;
  isActive?: boolean;
  approved?: boolean;
  createdAt?: string | Date;
  joinedDate?: string | Date;
  isBanned?: boolean;
 
}


const getStatCardClasses = (color: string) => {
  switch (color) {
    case 'yellow': return 'bg-yellow-500';
    case 'purple': return 'bg-purple-500';
    case 'green': return 'bg-green-500';
    case 'red': return 'bg-red-600';
    default: return 'bg-gray-500';
  }
};

const StatCard: React.FC<{ title: string; count: number; color: string; icon?: React.ReactNode }> = ({ title, count, color, icon }) => {
  const colorClass = getStatCardClasses(color);

  return (
    <div className={`p-4 rounded-xl shadow-lg flex items-center justify-between text-white ${colorClass}`}>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-3xl font-bold mt-1">{count}</div>
      </div>
      {icon && <div className="p-2 bg-white bg-opacity-20 rounded-full">{icon}</div>}
    </div>
  );
};

const AdminPageContent: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('accounts');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    newRegistrations: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const realUsers = await getAllUsers();
        console.log('Loaded real users:', realUsers);
        
      
        const usersArray: User[] = Array.isArray(realUsers) ? realUsers : realUsers?.users || [];
        console.log('📊 Processed users array:', usersArray);
      console.log('📊 Array length:', usersArray.length);
      
      if (usersArray.length > 0) {
        console.log('👤 First user object:', usersArray[0]);
        console.log('👤 First user keys:', Object.keys(usersArray[0]));
      }
        setUsers(usersArray);
        
       
        const total = usersArray.length;
        const pending = usersArray.filter(user => 
          user.status === 'pending' || 
          user.isActive === false || 
          user.approved === false
        ).length;
        const active = usersArray.filter(user => 
          user.status === 'active' || 
          user.isActive === true
        ).length;
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newRegistrations = usersArray.filter(user => {
           let createdAt: Date | null = null;
        
        if (user.createdAt) {
          createdAt = new Date(user.createdAt);
        } else if (user.joinedDate) {
          createdAt = new Date(user.joinedDate);
        }
        
       
        return createdAt && !isNaN(createdAt.getTime()) && createdAt > thirtyDaysAgo;
      }).length;
        
        setStats({
          total,
          pending,
          active,
          newRegistrations
        });
        
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    console.log('User logged out. Redirecting to login.');
    navigate('/login');
  };

const handleDeleteUser = async (userId: string, userName: string) => {
  console.log('🔄 handleDeleteUser called:', { userId, userName });
  
  if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
    return;
  }
  
  try {
    console.log('📤 Calling deleteUserById...');
    const result = await deleteUserById(userId);
    console.log('✅ Delete result:', result);
    
    // Remove from users state
    setUsers(prevUsers => {
      const newUsers = prevUsers.filter(user => user._id !== userId);
      console.log('📊 Users after delete:', newUsers.length);
      return newUsers;
    });
    
    // Update stats
    setStats(prev => ({
      ...prev,
      total: prev.total - 1,
      active: prev.active - (users.find(u => u._id === userId)?.isActive ? 1 : 0)
    }));
    
    alert(`✅ User "${userName}" deleted successfully!`);
    
  } catch (error) {
    console.error('❌ Delete failed:', error);
    alert(`❌ Failed to delete user "${userName}"`);
  }
};

  const navItems = [
    { name: 'Accounts', icon: <UserCircle className="w-5 h-5" />, key: 'accounts' },
    { name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, key: 'messages' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, key: 'settings' },
  ];

  const renderAccountsContent = () => {
    if (loading) {
      return (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading users...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
      
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            All ({users.length})
          </h3>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <SlidersHorizontal className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* User Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Head */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded text-blue-600" />
                </th>
                {['Image', 'Name', 'Joined Date', 'Email', 'Username', 'Status', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{header}</span>
                      
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id || user.id}>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded text-blue-600" />
                    </td>
                    
                    {/* User Image */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={user.profileImage || user.avatar || `https://placehold.co/40x40/333/fff?text=${(user.username || user.name || 'U').charAt(0).toUpperCase()}`}
                        alt={user.username || user.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => { 
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = 'https://placehold.co/40x40/dddddd/333?text=U'; 
                        }}
                      />
                    </td>
                    
                    {/* User Name */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name || user.username || 'No name'}
                    </td>
                    
                    {/* Joined Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Unknown date'
                      }
                    </td>
                    
                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || 'No email'}
                    </td>
                    
                    {/* Username */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      @{user.username || 'nousername'}
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.isActive === false || user.status === 'pending' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Pending
                        </span>
                      ) : user.isBanned || user.status === 'banned' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <Trash2 className="w-3 h-3 mr-1" /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" /> Active
                        </span>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="ml-2 text-red-600 hover:text-red-900 flex items-center"
                        onClick={() => handleDeleteUser(user._id || '', user.name || user.username || 'User')}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        {users.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-700">
            <span>Showing 1 to {Math.min(10, users.length)} of {users.length} entries</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span>Display</span>
                <select className="border border-gray-300 rounded-lg p-1 text-sm">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              {/* Pagination Controls */}
              <div className="flex space-x-1">
                <button className="p-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed">&lt;</button>
                {['1', '2', '3', '4'].map(page => (
                  <button 
                    key={page} 
                    className={`p-2 border border-gray-300 rounded-lg w-10 transition-colors ${page === '1' ? 'bg-red-600 text-white font-bold' : 'bg-white hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                ))}
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">&gt;</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-gray-800 flex flex-col shadow-lg border-r border-gray-200">
        <div className="p-6 text-xl font-bold text-gray-900 border-b border-gray-200">
          Coffeemates
        </div>

        <div className="p-6 text-sm">
          <p className="text-gray-500">Hello</p>
          <h2 className="text-lg font-semibold">Admin</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                activeTab === item.key
                  ? 'bg-red-50 text-red-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center w-full p-3 mb-2 rounded-lg bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors duration-200 shadow-md text-white font-semibold"
          >
            <span className="ml-3">Back</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg bg-red-600 hover:bg-red-700 cursor-pointer transition-colors duration-200 shadow-md text-white font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header/Stats Section */}
        <header className="p-6">
          {/* Total Account Stat */}
          <div className="mb-6 p-6 rounded-xl shadow-lg bg-white">
            <p className="text-lg font-medium text-gray-500">Total Account</p>
            <h2 className="text-6xl font-extrabold text-gray-900 mt-1">
              {stats.total}
            </h2>
          </div>

          {/* Four Colorful Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Pending Approval" 
              count={stats.pending} 
              color="yellow" 
              icon={<AlertTriangle className="w-6 h-6" />} 
            />
            <StatCard 
              title="New Registrations" 
              count={stats.newRegistrations} 
              color="purple" 
              icon={<Users className="w-6 h-6" />} 
            />
            <StatCard 
              title="Active Users" 
              count={stats.active} 
              color="green" 
              icon={<CheckCircle className="w-6 h-6" />} 
            />
            <StatCard 
              title="Total Users" 
              count={stats.total} 
              color="red" 
              icon={<LayoutDashboard className="w-6 h-6" />} 
            />
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-1 overflow-auto p-6 pt-0">
          {activeTab === 'accounts' && renderAccountsContent()}
          {activeTab === 'messages' && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Messages Dashboard</h2>
              <p className="text-gray-600">View and manage support tickets or private messages here.</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Site Settings</h2>
              <p className="text-gray-600">Configure global application settings.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  return <AdminPageContent />;
};

export default AdminPage;