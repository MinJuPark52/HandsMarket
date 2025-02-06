import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiHeart,
  FiSearch,
  FiMoon,
  FiSun,
  FiUser,
} from "react-icons/fi";

interface NavProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Nav: React.FC<NavProps> = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="max-w-[1020px] mx-auto flex justify-between items-center p-4 fixed top-0 left-0 right-0 z-[1000] bg-[#f3f3f3] dark:bg-gray-800 text-black dark:text-white">
        <div className="flex items-center relative">
          <p className="font-bold text-2xl text-gray-800 dark:text-white italic">
            <Link to="/">EShop</Link>
          </p>
        </div>

        <div className="flex justify-between gap-2">
          <button
            onClick={() => navigate("/login")}
            aria-label="로그인"
            className="text-black dark:text-white text-[1.56rem] leading-8 cursor-pointer m-[10px]"
          >
            <FiUser />
          </button>

          <button
            onClick={() => navigate("/")}
            aria-label="찜 목록"
            className="text-black dark:text-white text-[1.56rem] leading-8 cursor-pointer m-[10px]"
          >
            <FiHeart />
          </button>

          <button
            onClick={() => navigate("/cart")}
            aria-label="장바구니"
            className="text-black dark:text-white text-[1.56rem] leading-8 cursor-pointer m-[10px]"
          >
            <FiShoppingCart />
          </button>

          <button
            onClick={() => navigate("/search")}
            aria-label="검색"
            className="text-black dark:text-white text-[1.5rem] leading-8 cursor-pointer m-[10px]"
          >
            <FiSearch />
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="다크 모드 토글"
            className="text-black text-[1.56rem] leading-8 cursor-pointer m-[10px] dark:text-white"
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
    </>
  );
};

export default Nav;
