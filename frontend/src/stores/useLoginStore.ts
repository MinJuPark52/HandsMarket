import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoginState {
  uid: string;
  email: string;
  nickname: string;
  profileImage: string;
  userType: "buyer" | "seller" | "";
  isLoggedIn: boolean;
  setLogin: (
    uid: string,
    email: string,
    nickname: string,
    profileImage: string,
    userType?: "buyer" | "seller" | ""
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
      // 로그인 성공 시 사용자 정보와 로그인 상태를 저장
      setLogin: (uid, email, nickname, profileImage, userType = "") =>
        set({ uid, email, nickname, profileImage, userType, isLoggedIn: true }),
      // 로그아웃 시 상태 초기화
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
      name: "login-storage", // 로컬스토리지에 저장할 이름
      partialize: (state) => ({
        // 저장할 상태의 일부만 선택
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
