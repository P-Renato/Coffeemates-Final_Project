import React, { useState } from 'react';
// ADDED BrowserRouter, Routes, and Route to provide routing context
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, MessageSquare, AlertTriangle, Trash2, CheckCircle, ChevronDown, ChevronUp, Search, SlidersHorizontal, UserCircle, Settings } from 'lucide-react';

// Mock Data for the table
const MOCK_USER_DATA = [
  { image: 'https://placehold.co/40x40/fbcfe8/333?text=A', title: 'Arlene McCoy', joiningDate: 'September 9, 2013', email: 'example@gmail.com', accountName: '@lovecoffee', action: 'Pending Approval' },
  { image: 'https://placehold.co/40x40/c4b5fd/333?text=C', title: 'Cody Fisher', joiningDate: 'March 24, 2017', email: 'example@gmail.com', accountName: '@lovecoffee', action: 'Active' },
  { image: 'https://placehold.co/40x40/fed7aa/333?text=E', title: 'Esther Howard', joiningDate: 'December 29, 2012', email: 'example@gmail.com', accountName: '@lovecoffee', action: 'Active' },
  { image: 'https://placehold.co/40x40/a7f3d0/333?text=R', title: 'Ronald Richards', joiningDate: 'May 20, 2015', email: 'example@gmail.com', accountName: '@lovecoffee', action: 'Ban Tool' },
  { image: 'https://placehold.co/40x40/d1d5db/333?text=A', title: 'Albert Flores', joiningDate: 'May 15, 2015', email: 'example@gmail.com', accountName: '@lovecoffee', action: 'Active' },
  { image: 'https://placehold.co/40x40/fca5a5/333?text=M', title: 'Marvin McKinney', joiningDate: 'February 26, 2012', email: 'example@gmail.com', accountName: '@lovecoffee', action: 'Active' },
  { image: 'https://placehold.co/40x40/bae6fd/333?text=F', title: 'Floyd Miles', joiningDate: 'October 24, 2018', email: 'example@gmail.com', accountName: '@lovecoffee', action: 'Active' },
  { image: 'https://placehold.co/40x40/fce7f3/333?text=C', title: 'Courtney Henry', joiningDate: 'November 7, 2017', email: 'example@gmail.com', accountName: '@lovecoffee', action: 'Active' },
  { image: 'https://placehold.co/40x40/c7d2fe/333?text=G', title: 'Guy Hawkins', joiningDate: 'May 25, 2017', email: 'example@gmail.com', accountName: '@lovecoffee', action: 'Active' },
  { image: 'https://placehold.co/40x40/a5f3fc/333?text=R', title: 'Ralph Edwards', joiningDate: 'July 16, 2015', email: 'example@gmail.com', accountName: '@lovecoffee', action: 'Active' },
];

// Define color mappings for the StatCard component
// NOTE: Reverting this to a direct function with simple string concatenation to fix the environment error.
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
    // Ensure the color class is retrieved statically
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

// Renamed the core content component to avoid conflicting with the exported component name
const AdminPageContent: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('accounts');

  // Simple function to handle logout
 const handleLogout = () => {
  localStorage.removeItem('coffeematesToken');
  console.log('User logged out. Redirecting to login.');
  navigate('/login');  // This will now use the main app's router
};

  // Simplified navigation links for the sidebar matching the screenshot
  const navItems = [
    { name: 'Accounts', icon: <UserCircle className="w-5 h-5" />, key: 'accounts' },
    { name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, key: 'messages' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, key: 'settings' },
  ];
  
  // Renders the main User Management Table based on the screenshot
  const renderAccountsContent = () => (
    <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Table Filters/Header */}
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">All (9)</h3>
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
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><input type="checkbox" className="rounded text-blue-600" /></th>
                        {['Image', 'Title', 'Joining Date', 'Email', 'Account Name', 'Action'].map((header) => (
                            <th 
                                key={header} 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                <div className="flex items-center space-x-1">
                                    <span>{header}</span>
                                    {/* Mock Filter Icon (matching the "Y" circle design) */}
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white shadow-sm">Y</div>
                                </div>
                            </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                    {/* Mock Input Row */}
                    <tr>
                        <td className="px-2 py-4 whitespace-nowrap"><input type="checkbox" className="rounded text-blue-600" /></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><input type="text" placeholder="Enter Title..." className="border border-gray-300 rounded p-1 text-sm" /></td>
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                    </tr>
                    {MOCK_USER_DATA.map((user, index) => (
                        <tr key={index}>
                            <td className="px-2 py-4 whitespace-nowrap"><input type="checkbox" className="rounded text-blue-600" /></td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* Using placehold.co images */}
                                <img src={user.image} alt={user.title} className="w-10 h-10 rounded-full" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/40x40/dddddd/333?text=P'; }} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joiningDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.accountName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {/* Conditional styling for Action status */}
                                {user.action === 'Active' ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Active
                                    </span>
                                ) : user.action === 'Pending Approval' ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                        <AlertTriangle className="w-3 h-3 mr-1" /> Pending
                                    </span>
                                ) : (
                                    // Handle 'Ban Tool' or any other non-active state as 'Blocked'
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                        <Trash2 className="w-3 h-3 mr-1" /> Blocked
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="ml-2 text-red-600 hover:text-red-900 flex items-center">
                                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-700">
            <span>Showing 1 to 10 of 55 entries</span>
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
                        <button key={page} className={`p-2 border border-gray-300 rounded-lg w-10 transition-colors ${page === '1' ? 'bg-red-600 text-white font-bold' : 'bg-white hover:bg-gray-100'}`}>{page}</button>
                    ))}
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">&gt;</button>
                </div>
            </div>
        </div>
    </div>
  );


  // --- Component Structure ---
  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      
      {/* 1. Sidebar (Left - White Background) */}
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
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow-md text-white font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area (Right) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header/Stats Section */}
        <header className="p-6">
            {/* Total Account Stat */}
            <div className="mb-6 p-6 rounded-xl shadow-lg bg-white">
                <p className="text-lg font-medium text-gray-500">Total Account</p>
                <h2 className="text-6xl font-extrabold text-gray-900 mt-1">70</h2>
            </div>
            
            {/* Four Colorful Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Pending Approval" count={4} color="yellow" icon={<AlertTriangle className="w-6 h-6" />} />
                <StatCard title="New Registrations" count={6} color="purple" icon={<Users className="w-6 h-6" />} />
                <StatCard title="Registered Year" count={10} color="green" icon={<CheckCircle className="w-6 h-6" />} />
                <StatCard title="Active Users" count={10} color="red" icon={<LayoutDashboard className="w-6 h-6" />} />
            </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-1 overflow-auto p-6 pt-0">
          {/* Render the specific content for the active tab */}
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


// Wrapper component to provide Router context for local execution

const AdminPage: React.FC = () => {
  return <AdminPageContent />;
};

export default AdminPage;