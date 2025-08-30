import useLoginStore from "../stores/useLoginStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

const AuthListener = () => {
  const setLogin = useLoginStore((state) => state.setLogin);
  const logout = useLoginStore((state) => state.logout);

  useEffect(() => {
    // Firebase 인증 상태 변경 감지
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Firestore에서 사용자 정보 문서 가져오기
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          let nickname = "";
          let profileImage = "/default-profile.png";
          let userType: "user" | "seller" = "user";

          // 사용자 문서가 존재하면 정보 추출
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            nickname = data.nickname || "";
            profileImage = data.profileImage || "/default-profile.png";
            userType = data.userType || "user";
          }
          setLogin(
            user.uid,
            user.email || "",
            nickname,
            profileImage,
            userType
          );
        } catch (error) {
          setLogin(
            user.uid,
            user.email || "",
            "",
            "/default-profile.png",
            "user"
          );
        }
      } else {
        logout();
      }
    });

    // 컴포넌트가 언마운트되면 리스너 제거
    return () => unsubscribe();
  }, [setLogin, logout]);

  return null;
};

export default AuthListener;
