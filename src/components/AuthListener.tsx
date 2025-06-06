import useLoginStore from "../stores/useLoginStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

const AuthListener = () => {
  const setLogin = useLoginStore((state) => state.setLogin);
  const logout = useLoginStore((state) => state.logout);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          let nickname = "";
          let profileImage = "/default-profile.png";
          let userType: "user" | "seller" = "user";

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

    return () => unsubscribe();
  }, [setLogin, logout]);

  return null;
};

export default AuthListener;
