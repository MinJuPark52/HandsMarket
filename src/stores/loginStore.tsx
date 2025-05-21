import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoginState {
  id: string;
  password: string;
  error: string;
  isLoggedIn: boolean;
  setId: (id: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  setIsLoggedIn: (value: boolean) => void;
  resetState: () => void;
}

const LoginStore = create<LoginState>()(
  persist(
    (set) => ({
      id: "",
      password: "",
      error: "",
      isLoggedIn: false,
      setId: (id: string) => set({ id }),
      setPassword: (password: string) => set({ password }),
      setError: (error: string) => set({ error }),
      setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
      resetState: () =>
        set({ id: "", password: "", error: "", isLoggedIn: false }),
    }),
    {
      name: "login-storage",
      partialize: (state) => ({
        id: state.id,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default LoginStore;
