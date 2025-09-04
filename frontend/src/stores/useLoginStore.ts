import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoginState {
  user_id: string;
  email: string;
  name: string;
  profile_image: string;
  role: string;
  isLoggedIn: boolean;
  setLogin: (
    user_id: string,
    email: string,
    name: string,
    profile_image: string,
    role?: string
  ) => void;
  logout: () => void;
}

const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      user_id: "",
      email: "",
      name: "",
      profile_image: "",
      role: "",
      isLoggedIn: false,
      setLogin: (user_id, email, name, profile_image, role = "") =>
        set({ user_id, email, name, profile_image, role, isLoggedIn: true }),
      logout: () =>
        set({
          user_id: "",
          email: "",
          name: "",
          profile_image: "",
          role: "",
          isLoggedIn: false,
        }),
    }),
    {
      name: "login-storage",
      partialize: (state) => ({
        user_id: state.user_id,
        email: state.email,
        name: state.name,
        profile_image: state.profile_image,
        role: state.role,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useLoginStore;
