import { create } from 'zustand';

export interface User {
  name: string;
  avatar?: string;
  role: string;
}

interface UIState {
  isSidebarOpen: boolean;
  isLoggedIn: boolean;
  user: User | null;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  login: () => void;
  logout: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isLoggedIn: false,
  user: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  login: () =>
    set({
      isLoggedIn: true,
      user: {
        name: "Bartender Pro",
        avatar: "https://github.com/shadcn.png",
        role: "Owner",
      },
    }),
  logout: () => set({ isLoggedIn: false, user: null, isSidebarOpen: false }),
}));
