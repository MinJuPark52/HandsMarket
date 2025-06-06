import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import useLoginStore from "../../stores/useLoginStore";
import { BeatLoader } from "react-spinners";
import { GoChevronRight } from "react-icons/go";

const Profile = () => {
  const { email, nickname, profileImage, isLoggedIn, logout, userType } =
    useLoginStore();
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
      alert("로그아웃되었습니다.");
      navigate("/");
    } catch (error: any) {
      console.log("로그아웃 오류: ", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-20">
        <BeatLoader color="#9CA3AF" size={13} margin={3} />
      </div>
    );

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen max-w-[1024px] mx-auto mt-20">
      <div className="bg-gray-100 h-[100px] p-6 flex items-center gap-4">
        <img
          src={profileImage || "/default-profile.png"}
          alt="프로필 사진"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {nickname}님 안녕하세요!
          </h3>
          <p className="text-md text-gray-700">{email}</p>
        </div>
      </div>

      {/* 메뉴 카드들 */}
      <div className="flex flex-col">
        {/* 공통 */}
        <Link
          to="/editor"
          className="bg-white p-4 flex items-center justify-between border-b"
        >
          <span className="font-semibold text-gray-700">정보 수정</span>
          <span className="text-gray-600">
            <GoChevronRight size={20} />
          </span>
        </Link>
      </div>

      {/* 사용자 */}
      {userType === "user" && (
        <>
          <div className="bg-white p-4 flex items-center justify-between border-b">
            <span className="font-semibold text-gray-700">결제 목록</span>
            <span className="text-gray-600">
              <GoChevronRight size={20} />
            </span>
          </div>
        </>
      )}

      {/* 판매자 */}
      {userType === "seller" && (
        <>
          <Link
            to="/productform"
            className="bg-white p-4 flex items-center justify-between border-b"
          >
            <span className="font-semibold text-gray-700">상품 등록</span>
            <span className="text-gray-600">
              <GoChevronRight size={20} />
            </span>
          </Link>
          <div className="bg-white p-4 flex items-center justify-between border-b">
            <span className="font-semibold text-gray-700">등록한 상품</span>
            <span className="text-gray-600">
              <GoChevronRight size={20} />
            </span>
          </div>
        </>
      )}

      <div
        className="bg-white p-4 flex items-center justify-between border-b cursor-pointer"
        onClick={handleLogout}
      >
        <span className="font-semibold text-gray-700">로그아웃</span>
      </div>

      <div className="bg-white p-4 flex items-center justify-between border-b">
        <span className="text-gray-700">회원 탈퇴</span>
      </div>
    </div>
  );
};

export default Profile;
