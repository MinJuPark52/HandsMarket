import React, { useState, useRef } from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="max-w-[1020px] mx-auto flex justify-between items-center p-4 fixed top-0 left-0 right-0 z-[1000] bg-[#f3f3f3] dark:bg-gray-800 text-black dark:text-white">
        <div className="flex items-center relative">
          <p className="font-bold text-2xl text-gray-800 dark:text-white italic">
            <Link to="/">EShop</Link>
          </p>
        </div>

        <div className="flex justify-between gap-2">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="로그인 상태"
                className="text-black dark:text-white text-[1.56rem] leading-8 cursor-pointer m-[10px]"
              >
                <FiUser />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-11 right-0 border bg-white dark:bg-gray-600 text-black dark:text-white shadow-md rounded-md p-2 z-50">
                  <button
                    onClick={handleLoginLogout}
                    className="w-[6rem] text-[1.2rem] px-2"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              aria-label="로그인"
              className="text-black dark:text-white text-[1.56rem] leading-8 cursor-pointer m-[10px]"
            >
              <FiUser />
            </button>
          )}

          {isLoggedIn && (
            <>
              <button
                onClick={() => navigate("/wish")}
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
            </>
          )}

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
