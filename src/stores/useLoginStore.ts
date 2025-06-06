import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoginState {
  uid: string;
  email: string;
  nickname: string;
  profileImage: string;
  userType: "user" | "seller" | "";
  isLoggedIn: boolean;
  setLogin: (
    uid: string,
    email: string,
    nickname: string,
    profileImage: string,
    userType?: "user" | "seller" | ""
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
      userType: "",
      isLoggedIn: false,
      setLogin: (uid, email, nickname, profileImage, userType = "") =>
        set({ uid, email, nickname, profileImage, userType, isLoggedIn: true }),
      logout: () =>
        set({
          uid: "",
          email: "",
          nickname: "",
          profileImage: "",
          userType: "",
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
        userType: state.userType,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useLoginStore;
