import React from "react";
import LoginStore from "../../stores/loginStore";
import { useNavigate, Link } from "react-router-dom";
import {
  FiShoppingCart,
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
  const isLoggedIn = LoginStore((state) => state.isLoggedIn);

  return (
    <div className="max-w-[1024px] mx-auto flex justify-between items-center p-4 fixed top-0 left-0 right-0 z-[1000] bg-[#f3f3f3] dark:bg-gray-800 text-black dark:text-white">
      <div className="flex items-center relative">
        <p className="font-bold text-2xl text-gray-800 dark:text-white italic">
          <Link to="/">EShop</Link>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label="다크 모드 토글"
          className="text-[1.56rem] leading-8 cursor-pointer m-[10px]"
        >
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>

        <button
          onClick={() => navigate("/search")}
          aria-label="검색"
          className="text-[1.5rem] leading-8 cursor-pointer m-[10px]"
        >
          <FiSearch />
        </button>

        <button
          onClick={() => navigate("/cart")}
          aria-label="장바구니"
          className="text-[1.56rem] leading-8 cursor-pointer m-[10px]"
        >
          <FiShoppingCart />
        </button>

        <button
          onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
          aria-label={isLoggedIn ? "마이페이지" : "로그인"}
          className="text-[1.56rem] leading-8 cursor-pointer m-[10px]"
        >
          <FiUser />
        </button>
      </div>
    </div>
  );
};

export default Nav;
