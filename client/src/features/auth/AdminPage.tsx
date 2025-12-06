import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, LayoutDashboard, Users, MessageSquare, AlertTriangle, 
  Trash2, CheckCircle, Search, Eye, Flag, Shield,
  SlidersHorizontal, UserCircle, Settings, Mail, Clock, UserCheck, Ban
} from 'lucide-react';

// Mock user data with investigation status
const MOCK_USERS = [
  {
    _id: '1',
    name: 'Alex Johnson',
    username: 'coffeelover',
    email: 'alex@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=1',
    status: 'active',
    isActive: true,
    approved: true,
    createdAt: '2024-01-15T10:30:00Z',
    isBanned: false,
    underInvestigation: false,
    reports: 0
  },
  {
    _id: '2',
    name: 'Maria Garcia',
    username: 'latteart',
    email: 'maria@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=5',
    status: 'active',
    isActive: true,
    approved: true,
    createdAt: '2024-02-20T14:45:00Z',
    isBanned: false,
    underInvestigation: false,
    reports: 0
  },
  {
    _id: '3',
    name: 'David Chen',
    username: 'espressofan',
    email: 'david@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=8',
    status: 'pending',
    isActive: false,
    approved: false,
    createdAt: '2024-03-10T09:15:00Z',
    isBanned: false,
    underInvestigation: false,
    reports: 0
  },
  {
    _id: '4',
    name: 'Sarah Williams',
    username: 'brewmaster',
    email: 'sarah@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    status: 'active',
    isActive: true,
    approved: true,
    createdAt: '2023-12-05T16:20:00Z',
    isBanned: false,
    underInvestigation: false,
    reports: 0
  },
  {
    _id: '5',
    name: 'Michael Brown',
    username: 'beanhunter',
    email: 'michael@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=15',
    status: 'banned',
    isActive: false,
    approved: false,
    createdAt: '2024-01-30T11:10:00Z',
    isBanned: true,
    underInvestigation: false,
    reports: 5
  },
  {
    _id: '6',
    name: 'Jessica Lee',
    username: 'mochamagic',
    email: 'jessica@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=20',
    status: 'pending',
    isActive: false,
    approved: false,
    createdAt: '2024-03-25T13:40:00Z',
    isBanned: false,
    underInvestigation: false,
    reports: 0
  },
  {
    _id: '7',
    name: 'Olivia Taylor',
    username: 'caffeinequeen',
    email: 'olivia@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=25',
    status: 'under_investigation', // NEW STATUS
    isActive: false,
    approved: true,
    createdAt: '2024-02-28T08:55:00Z',
    isBanned: false,
    underInvestigation: true,
    reports: 3,
    investigationReason: 'Inappropriate comments'
  },
  {
    _id: '8',
    name: 'Robert Kim',
    username: 'filterfanatic',
    email: 'robert@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=30',
    status: 'active',
    isActive: true,
    approved: true,
    createdAt: '2024-03-18T12:25:00Z',
    isBanned: false,
    underInvestigation: false,
    reports: 0
  },
  {
    _id: '9',
    name: 'Thomas Wilson',
    username: 'cappuccinoking',
    email: 'thomas@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=35',
    status: 'under_investigation', // NEW STATUS
    isActive: false,
    approved: true,
    createdAt: '2024-03-22T10:05:00Z',
    isBanned: false,
    underInvestigation: true,
    reports: 2,
    investigationReason: 'Harassment reports'
  },
  {
    _id: '10',
    name: 'Sophie Martinez',
    username: 'arabicaaddict',
    email: 'sophie@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=40',
    status: 'under_investigation', // NEW STATUS
    isActive: false,
    approved: true,
    createdAt: '2024-01-08T15:50:00Z',
    isBanned: false,
    underInvestigation: true,
    reports: 4,
    investigationReason: 'Spam posting'
  },
  {
    _id: '11',
    name: 'James Anderson',
    username: 'coldbrewcrew',
    email: 'james@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=45',
    status: 'under_investigation', // NEW STATUS
    isActive: false,
    approved: true,
    createdAt: '2024-02-15T11:20:00Z',
    isBanned: false,
    underInvestigation: true,
    reports: 6,
    investigationReason: 'Multiple community violations'
  },
  {
    _id: '12',
    name: 'Emma Clark',
    username: 'baristabuddy',
    email: 'emma@example.com',
    profileImage: 'https://i.pravatar.cc/150?img=50',
    status: 'active',
    isActive: true,
    approved: true,
    createdAt: '2024-02-10T09:45:00Z',
    isBanned: false,
    underInvestigation: false,
    reports: 0
  }
];

// Mock support tickets for investigation cases
const MOCK_TICKETS = [
  {
    id: 'ticket-1',
    userId: '7',
    userName: 'Olivia Taylor',
    userAvatar: 'https://i.pravatar.cc/150?img=25',
    subject: 'Inappropriate Comments Investigation',
    reason: 'User reported for offensive comments in coffee forums',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-03-28T14:30:00Z',
    lastUpdated: '2024-03-28T14:30:00Z',
    messages: 3,
    assignedTo: null
  },
  {
    id: 'ticket-2',
    userId: '9',
    userName: 'Thomas Wilson',
    userAvatar: 'https://i.pravatar.cc/150?img=35',
    subject: 'Harassment Reports - Urgent',
    reason: 'Multiple users reported harassment in private messages',
    status: 'pending',
    priority: 'urgent',
    createdAt: '2024-03-27T11:15:00Z',
    lastUpdated: '2024-03-27T11:15:00Z',
    messages: 5,
    assignedTo: null
  },
  {
    id: 'ticket-3',
    userId: '10',
    userName: 'Sophie Martinez',
    userAvatar: 'https://i.pravatar.cc/150?img=40',
    subject: 'Spam Posting Investigation',
    reason: 'User posting commercial content in non-commercial sections',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-26T16:45:00Z',
    lastUpdated: '2024-03-26T16:45:00Z',
    messages: 2,
    assignedTo: null
  },
  {
    id: 'ticket-4',
    userId: '11',
    userName: 'James Anderson',
    userAvatar: 'https://i.pravatar.cc/150?img=45',
    subject: 'Multiple Community Violations',
    reason: 'User has accumulated 6 reports for various violations',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-03-25T09:20:00Z',
    lastUpdated: '2024-03-25T09:20:00Z',
    messages: 8,
    assignedTo: null
  },
  {
    id: 'ticket-5',
    userId: '5',
    userName: 'Michael Brown',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    subject: 'Ban Appeal Request',
    reason: 'User requesting ban appeal after 30 days',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-03-20T13:10:00Z',
    lastUpdated: '2024-03-24T10:30:00Z',
    messages: 12,
    assignedTo: 'Admin'
  }
];

// Mock API functions
const mockGetAllUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_USERS;
};

const mockDeleteUserById = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`Mock delete called for user ID: ${userId}`);
  return { success: true, message: 'User deleted successfully' };
};

const mockGetTickets = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return MOCK_TICKETS;
};

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
  underInvestigation?: boolean;
  reports?: number;
  investigationReason?: string;
}

interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  subject: string;
  reason: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdated: string;
  messages: number;
  assignedTo: string | null;
}

const getStatCardClasses = (color: string) => {
  switch (color) {
    case 'yellow': return 'bg-yellow-500';
    case 'purple': return 'bg-purple-500';
    case 'green': return 'bg-green-500';
    case 'red': return 'bg-red-600';
    case 'orange': return 'bg-orange-500';
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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    newRegistrations: 0,
    underInvestigation: 0,
    pendingTickets: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const mockUsers = await mockGetAllUsers();
        const usersArray: User[] = Array.isArray(mockUsers) ? mockUsers : [];
        setUsers(usersArray);
        
        // Fetch tickets
        setTicketsLoading(true);
        const mockTickets = await mockGetTickets();
        setTickets(mockTickets);
        setTicketsLoading(false);
        
        // Calculate stats
        const total = usersArray.length;
        const pending = usersArray.filter(user => 
          user.status === 'pending'
        ).length;
        const active = usersArray.filter(user => 
          user.status === 'active'
        ).length;
        const underInvestigation = usersArray.filter(user => 
          user.status === 'under_investigation'
        ).length;
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newRegistrations = usersArray.filter(user => {
          if (!user.createdAt) return false;
          const createdAt = new Date(user.createdAt);
          return !isNaN(createdAt.getTime()) && createdAt > thirtyDaysAgo;
        }).length;
        
        const pendingTickets = mockTickets.filter(ticket => 
          ticket.status === 'pending'
        ).length;
        
        setStats({
          total,
          pending,
          active,
          newRegistrations,
          underInvestigation,
          pendingTickets
        });
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to mock data
        setUsers(MOCK_USERS);
        setTickets(MOCK_TICKETS);
        setStats({
          total: MOCK_USERS.length,
          pending: 2,
          active: 6,
          newRegistrations: 5,
          underInvestigation: 4,
          pendingTickets: 4
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    console.log('User logged out. Redirecting to login.');
    navigate('/login');
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    console.log('🗑️ Deleting user:', { userId, userName });
    
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }
    
    try {
      const result = await mockDeleteUserById(userId);
      console.log('✅ Mock delete result:', result);
      
      // Update UI
      setUsers(prevUsers => {
        const newUsers = prevUsers.filter(user => user._id !== userId);
        return newUsers;
      });
      
      // Also remove any tickets for this user
      setTickets(prevTickets => 
        prevTickets.filter(ticket => ticket.userId !== userId)
      );
      
      // Update stats
      const deletedUser = users.find(u => u._id === userId);
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        pending: deletedUser?.status === 'pending' ? prev.pending - 1 : prev.pending,
        active: deletedUser?.status === 'active' ? prev.active - 1 : prev.active,
        underInvestigation: deletedUser?.status === 'under_investigation' ? prev.underInvestigation - 1 : prev.underInvestigation
      }));
      
      alert(`✅ User "${userName}" deleted successfully!`);
      
    } catch (error) {
      console.error('❌ Delete simulation failed:', error);
      alert(`❌ Failed to delete user "${userName}"`);
    }
  };

  const handleResolveInvestigation = (userId: string, action: 'warn' | 'suspend' | 'ban') => {
    const user = users.find(u => u._id === userId);
    if (!user) return;
    
    const actionMessages = {
      warn: 'User warned. Investigation resolved.',
      suspend: 'User suspended for 7 days.',
      ban: 'User permanently banned.'
    };
    
    if (window.confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      // Update user status
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u._id === userId 
            ? { 
                ...u, 
                status: action === 'ban' ? 'banned' : 'active',
                underInvestigation: false,
                isActive: action !== 'ban'
              } 
            : u
        )
      );
      
      // Update tickets
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.userId === userId && ticket.status === 'pending'
            ? { ...ticket, status: 'resolved', lastUpdated: new Date().toISOString() }
            : ticket
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        underInvestigation: prev.underInvestigation - 1,
        pendingTickets: tickets.filter(t => t.userId === userId && t.status === 'pending').length > 0 
          ? prev.pendingTickets - 1 
          : prev.pendingTickets
      }));
      
      alert(`✅ ${actionMessages[action]}`);
    }
  };

  const handleAssignTicket = (ticketId: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, assignedTo: 'You', status: 'in_progress' as const }
          : ticket
      )
    );
    alert('🎯 Ticket assigned to you!');
  };

  const navItems = [
    { name: 'Accounts', icon: <UserCircle className="w-5 h-5" />, key: 'accounts', badge: stats.underInvestigation },
    { name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, key: 'messages', badge: stats.pendingTickets },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, key: 'settings' },
  ];

  const getStatusBadge = (user: User) => {
    if (user.status === 'under_investigation') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
          <Shield className="w-3 h-3 mr-1" /> Investigation
        </span>
      );
    } else if (user.status === 'pending') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          <AlertTriangle className="w-3 h-3 mr-1" /> Pending
        </span>
      );
    } else if (user.isBanned || user.status === 'banned') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          <Ban className="w-3 h-3 mr-1" /> Banned
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Active
        </span>
      );
    }
  };

  const getPriorityBadge = (priority: Ticket['priority']) => {
    const styles = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    
    const icons = {
      urgent: <AlertTriangle className="w-3 h-3" />,
      high: <Flag className="w-3 h-3" />,
      medium: <Clock className="w-3 h-3" />,
      low: <Mail className="w-3 h-3" />
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${styles[priority]}`}>
        {icons[priority]}
        <span className="ml-1 capitalize">{priority}</span>
      </span>
    );
  };

  const renderAccountsContent = () => {
    if (loading) {
      return (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <div className="text-gray-500">Loading user data...</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            User Management ({users.length} users)
          </h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  if (searchTerm) {
                    const filtered = MOCK_USERS.filter(user => 
                      user.name?.toLowerCase().includes(searchTerm) ||
                      user.username?.toLowerCase().includes(searchTerm) ||
                      user.email?.toLowerCase().includes(searchTerm) ||
                      user.status?.toLowerCase().includes(searchTerm)
                    );
                    setUsers(filtered);
                  } else {
                    setUsers(MOCK_USERS);
                  }
                }}
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* User Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded text-blue-600" />
                </th>
                {['Image', 'Name', 'Joined Date', 'Email', 'Username', 'Status', 'Reports', 'Actions'].map((header) => (
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
            
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Users className="w-12 h-12 text-gray-300 mb-2" />
                      <p>No users found</p>
                      <button 
                        onClick={() => setUsers(MOCK_USERS)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Reset to show all users
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded text-blue-600" />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={user.profileImage || user.avatar || `https://ui-avatars.com/api/?name=${(user.username || user.name || 'U')}&background=random`}
                        alt={user.username || user.name}
                        className="w-10 h-10 rounded-full border border-gray-200"
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {user.name || user.username || 'No name'}
                        {user._id === '1' && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'Unknown date'
                      }
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || 'No email'}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-mono">@{user.username || 'nousername'}</span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Flag className={`w-4 h-4 mr-1 ${user.reports && user.reports > 0 ? 'text-red-500' : 'text-gray-300'}`} />
                        <span className={user.reports && user.reports > 0 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                          {user.reports || 0}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.status === 'under_investigation' ? (
                          <>
                            <button 
                              className="px-3 py-1 text-yellow-600 hover:text-yellow-800 border border-yellow-200 hover:border-yellow-300 rounded-lg transition-colors"
                              onClick={() => handleResolveInvestigation(user._id!, 'warn')}
                            >
                              Warn
                            </button>
                            <button 
                              className="px-3 py-1 text-orange-600 hover:text-orange-800 border border-orange-200 hover:border-orange-300 rounded-lg transition-colors"
                              onClick={() => handleResolveInvestigation(user._id!, 'suspend')}
                            >
                              Suspend
                            </button>
                            <button 
                              className="px-3 py-1 text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-lg transition-colors"
                              onClick={() => handleResolveInvestigation(user._id!, 'ban')}
                            >
                              Ban
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="px-3 py-1 text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-lg transition-colors"
                              onClick={() => alert(`Viewing profile of ${user.name || user.username}`)}
                            >
                              <Eye className="w-3 h-3 inline mr-1" /> View
                            </button>
                            <button 
                              className="px-3 py-1 text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-lg transition-colors"
                              onClick={() => handleDeleteUser(user._id!, user.name || user.username || 'User')}
                            >
                              <Trash2 className="w-3 h-3 inline mr-1" /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderMessagesContent = () => {
    const pendingTickets = tickets.filter(t => t.status === 'pending');

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MessageSquare className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold">Investigation Tickets</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              {pendingTickets.length} Pending
            </span>
          </div>
        </div>

        {ticketsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <div className="text-gray-500">Loading tickets...</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTickets.length === 0 ? (
              <div className="border rounded-lg p-8 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No pending tickets</p>
                <p className="text-gray-500 text-sm">All investigations have been resolved.</p>
              </div>
            ) : (
              pendingTickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={ticket.userAvatar} 
                        alt={ticket.userName}
                        className="w-12 h-12 rounded-full border border-gray-300"
                      />
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{ticket.subject}</h3>
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{ticket.reason}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>👤 {ticket.userName}</span>
                          <span>📅 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <span>💬 {ticket.messages} messages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {!ticket.assignedTo ? (
                        <button 
                          onClick={() => handleAssignTicket(ticket.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Assign to Me
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          👤 {ticket.assignedTo}
                        </span>
                      )}
                      <button 
                        onClick={() => alert(`Viewing ticket: ${ticket.subject}`)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Resolved tickets section */}
            {tickets.filter(t => t.status === 'resolved').length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recently Resolved</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tickets
                    .filter(t => t.status === 'resolved')
                    .slice(0, 4)
                    .map(ticket => (
                      <div key={ticket.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{ticket.subject}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Resolved
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {ticket.userName} • {new Date(ticket.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-gray-800 flex flex-col shadow-lg border-r border-gray-200">
        <div className="p-6 text-xl font-bold text-gray-900 border-b border-gray-200 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-red-600" />
          Admin Dashboard
        </div>

        <div className="p-6 text-sm">
          <p className="text-gray-500">Administrator</p>
          <h2 className="text-lg font-semibold">Security & Moderation</h2>
          <p className="text-gray-500 text-xs mt-1">Last login: Today, 10:30 AM</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 relative ${
                activeTab === item.key
                  ? 'bg-red-50 text-red-600 font-semibold border-l-4 border-red-600'
                  : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === item.key 
                    ? 'bg-red-500 text-white' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors duration-200 shadow-md text-white font-semibold"
          >
            <span className="ml-2">Back to Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-3 rounded-lg bg-red-600 hover:bg-red-700 cursor-pointer transition-colors duration-200 shadow-md text-white font-semibold"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header/Stats Section */}
        <header className="p-6">
          {/* Total Account Stat */}
          <div className="mb-6 p-6 rounded-xl shadow-lg bg-white border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-medium text-gray-500">Admin Dashboard</p>
                <h2 className="text-6xl font-extrabold text-gray-900 mt-1">
                  {stats.total}
                </h2>
                <p className="text-gray-500 mt-2">Total Users</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Active Investigations</p>
                <p className="text-4xl font-bold text-orange-600">{stats.underInvestigation}</p>
              </div>
            </div>
          </div>

          {/* Six Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard 
              title="Total Users" 
              count={stats.total} 
              color="red" 
              icon={<LayoutDashboard className="w-6 h-6" />} 
            />
            <StatCard 
              title="Pending Approval" 
              count={stats.pending} 
              color="yellow" 
              icon={<AlertTriangle className="w-6 h-6" />} 
            />
            <StatCard 
              title="Active Users" 
              count={stats.active} 
              color="green" 
              icon={<UserCheck className="w-6 h-6" />} 
            />
            <StatCard 
              title="New (30 days)" 
              count={stats.newRegistrations} 
              color="purple" 
              icon={<Users className="w-6 h-6" />} 
            />
            <StatCard 
              title="Under Investigation" 
              count={stats.underInvestigation} 
              color="orange" 
              icon={<Shield className="w-6 h-6" />} 
            />
            <StatCard 
              title="Pending Tickets" 
              count={stats.pendingTickets} 
              color="blue" 
              icon={<MessageSquare className="w-6 h-6" />} 
            />
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-1 overflow-auto p-6 pt-0">
          {activeTab === 'accounts' && renderAccountsContent()}
          {activeTab === 'messages' && renderMessagesContent()}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold">Moderation Settings</h2>
              </div>
              <div className="border rounded-lg p-6">
                <p className="text-gray-600 mb-4">Configure community moderation rules.</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Auto-flag Content</span>
                      <p className="text-sm text-gray-500">Automatically flag posts with inappropriate language</p>
                    </div>
                    <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">Enabled</button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Report Threshold</span>
                      <p className="text-sm text-gray-500">Users with 3+ reports go under investigation</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="number" defaultValue={3} className="w-16 px-2 py-1 border rounded" />
                      <span className="text-gray-500">reports</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Investigation Alerts</span>
                      <p className="text-sm text-gray-500">Notify admins of new investigations</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">Enabled</button>
                  </div>
                </div>
              </div>
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