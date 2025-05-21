import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userInfo, setUserInfo] = useState<{
    email: string;
    displayName: string | null;
  }>({
    email: "",
    displayName: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setUserInfo({
        email: user.email || "",
        displayName: user.displayName,
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert("로그아웃되었습니다.");
      navigate("/");
    } catch (error: any) {
      console.log("로그아웃 오류: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 max-w-[1024px] mx-auto py-20">
      <div className="bg-gray-200 h-[120px] p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-800" />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {userInfo.displayName}님 안녕하세요!
          </h3>
          <p className="text-md text-gray-700">{userInfo.email}</p>
        </div>
      </div>

      {/* 메뉴 카드들 */}
      <div className="flex flex-col ">
        <div className="bg-white p-4 flex items-center justify-between border">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">프로필 수정</span>
          </div>
          <span className="text-gray-500">{">"}</span>
        </div>
        <div className="bg-white p-4 flex items-center justify-between border">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">관심 상품</span>
          </div>
          <span className="text-gray-500">{">"}</span>
        </div>
        <div className="bg-white p-4 flex items-center justify-between border">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">최근 본 상품</span>
          </div>
          <span className="text-gray-500">{">"}</span>
        </div>
        <div className="bg-white p-4 flex items-center justify-between border">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">
              판매자 문의 내역
            </span>
          </div>
          <span className="text-gray-500">{">"}</span>
        </div>
        <div
          className="bg-white p-4 flex items-center justify-between border cursor-pointer"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">로그아웃</span>
          </div>
        </div>
        <div className="bg-white p-4 flex items-center justify-between border">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">회원탈퇴</span>
          </div>
        </div>
      </div>

      <div className="flex p-2">
        <span className="text-gray-700"></span>
      </div>
    </div>
  );
};

export default Profile;
