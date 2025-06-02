import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoginState {
  uid: string;
  email: string;
  nickname: string;
  profileImage: string;
  isLoggedIn: boolean;
  setLogin: (
    uid: string,
    email: string,
    nickname: string,
    profileImage: string
  ) => void;
  logout: () => void;
}

const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      uid: "",
      email: "",
      nickname: "",
      profileImage: "",
      isLoggedIn: false,
      setLogin: (uid, email, nickname, profileImage) =>
        set({ uid, email, nickname, profileImage, isLoggedIn: true }),
      logout: () =>
        set({
          uid: "",
          email: "",
          nickname: "",
          profileImage: "",
          isLoggedIn: false,
        }),
    }),
    {
      name: "login-storage",
      partialize: (state) => ({
        uid: state.uid,
        email: state.email,
        nickname: state.nickname,
        profileImage: state.profileImage,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useLoginStore;
