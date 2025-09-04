import React, { useState } from "react";
import useLoginStore from "../../stores/useLoginStore";
import { useNavigate, Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiSearch,
  FiMoon,
  FiSun,
  FiUser,
} from "react-icons/fi";
import SearchPageModal from "../modal/search";

interface NavProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Nav: React.FC<NavProps> = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="max-w-[768px] mx-auto flex justify-between items-center pt-4 fixed top-0 left-0 right-0 z-[1000] bg-[#ffffff] dark:bg-gray-800 text-black dark:text-white">
        <div className="flex items-center relative">
          <p className="text-orange-500 font-bold text-2xl dark:text-white italic">
            <Link to="/">HandsMarket</Link>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="다크 모드 토글"
            className="text-[1.3rem] leading-8 cursor-pointer m-[10px]"
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="검색"
            className="text-[1.3rem] leading-8 cursor-pointer m-[10px]"
          >
            <FiSearch />
          </button>

          <button
            onClick={() => navigate("/cart")}
            aria-label="장바구니"
            className="text-[1.3rem] leading-8 cursor-pointer m-[10px]"
          >
            <FiShoppingCart />
          </button>

          <button
            onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
            aria-label={isLoggedIn ? "마이페이지" : "로그인"}
            className="text-[1.3rem] leading-8 cursor-pointer m-[10px]"
          >
            <FiUser />
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <SearchPageModal onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
};

export default Nav;
