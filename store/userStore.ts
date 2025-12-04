import { create } from "zustand";

type LocalState = {
  token: string | null;
  username: string | null;
  setToken: (token: string | null) => void;
  setUsername: (username: string | null) => void;
};

export const useUserStore = create<LocalState>((set) => ({
  token: null,
  username: null,
  setToken: (token) => set({ token }),
  setUsername: (username) => set({ username }),
}));