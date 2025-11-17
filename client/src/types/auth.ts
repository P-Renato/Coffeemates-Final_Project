export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}