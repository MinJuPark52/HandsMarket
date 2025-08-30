import { create } from "zustand";

interface SignupState {
  id: string;
  password: string;
  passwordAgain: string;
  nickname: string;
  emailDomain: "@gmail.com" | "@naver.com" | "@outlook.com" | "@daum.com";
  userType: "user" | "seller";
  error: string;
  setField: (
    field: keyof Omit<
      SignupState,
      "setField" | "setUserType" | "resetError" | "setError"
    >,
    value: string
  ) => void;
  setUserType: (type: "user" | "seller") => void;
  resetError: () => void;
  setError: (error: string) => void;
}

const useSignupStore = create<SignupState>((set) => ({
  id: "",
  password: "",
  passwordAgain: "",
  nickname: "",
  emailDomain: "@gmail.com",
  userType: "user",
  error: "",
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setUserType: (type) => set({ userType: type }),
  resetError: () => set({ error: "" }),
  setError: (error) => set({ error }),
}));

export default useSignupStore;
