import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  setIsAuthenticated: (authenticated: boolean) => void;
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  token: null,
  user: null,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => set({ 
    isAuthenticated: false, 
    token: null, 
    user: null 
  }),
}));
