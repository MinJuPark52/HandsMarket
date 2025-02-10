import { create } from "zustand";

interface LoginState {
  id: string;
  password: string;
  error: string;
  setId: (id: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  resetState: () => void;
}

const LoginStore = create<LoginState>((set: any) => ({
  id: "",
  password: "",
  error: "",
  setId: (id: string) => set({ id }),
  setPassword: (password: string) => set({ password }),
  setError: (error: string) => set({ error }),
  resetState: () => set({ id: "", password: "", error: "" }),
}));

export default LoginStore;
