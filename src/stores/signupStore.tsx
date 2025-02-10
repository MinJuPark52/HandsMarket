import { create } from "zustand";

const useSignupStore = create((set: any) => ({
  id: "",
  password: "",
  passwordAgain: "",
  nickname: "",
  emailDomain: "@gmail.com",
  error: "",
  setField: (field: any, value: any) =>
    set((state: any) => ({ ...state, [field]: value })),
  resetError: () => set({ error: "" }),
  setError: (error: any) => set({ error }),
}));

export default useSignupStore;
