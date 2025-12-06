export interface User {
  id: string;
  email: string;
  username: string;
  photoURL: string;
  _id: string;
  // Add other user properties as needed
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void; 
}