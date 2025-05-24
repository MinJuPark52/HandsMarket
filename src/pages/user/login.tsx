import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginStore from "../../stores/loginStore";

const LoginPage: React.FC = () => {
  const { id, password, error, setId, setPassword, setError, setIsLoggedIn } =
    LoginStore();
  const navigate = useNavigate();

  const loginSubmit = async (e: any) => {
    e.preventDefault();

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!id && !password) {
      setError("이메일 또는 비밀번호를 입력해주세요");
      return;
    } else if (!id) {
      setError("이메일을 입력해주세요");
      return;
    } else if (!emailRegex.test(id)) {
      setError("유효한 이메일 형식을 입력해주세요");
      return;
    } else if (!password) {
      setError("비밀번호를 입력해주세요");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{6,12}$/;
    if (!passwordRegex.test(password)) {
      setError("비밀번호는 특수문자, 대소문자, 숫자를 포함하여 입력해주세요");
      return;
    }

    setError("");

    try {
      setIsLoggedIn(true);
      alert("로그인되었습니다.");
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("로그인에 실패했습니다. 다시 시도해 주세요.");
        console.error("로그인 실패:", error.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
        console.error("알 수 없는 오류:", error);
      }
    }
  };

  return (
    <div className="mt-[5rem]">
      <form
        className="mx-auto w-full max-w-[1024px] text-center"
        onSubmit={loginSubmit}
      >
        <div className="w-full max-w-[600px] mx-auto text-left">
          <div className="dark:text-white text-sm no-underline mb-4">
            <h1 className="text-3xl font-semibold dark:text-white">SignIn</h1>
          </div>
        </div>

        <div>
          <input
            className="w-[600px] h-[50px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:outline-none"
            placeholder="이메일"
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div>
          <input
            className="w-[600px] h-[50px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:outline-none"
            placeholder="비밀번호"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <button
          className="mt-2 w-[600px] h-[50px] p-3 bg-orange-500 text-white text-base rounded-md cursor-pointer hover:bg-orange-600"
          type="submit"
        >
          로그인
        </button>

        <div className="w-full max-w-[600px] mx-auto text-left">
          <div className="dark:text-white text-sm no-underline mt-4">
            <span className="text-gray-600">계정이 없으신가요?</span>
            <Link to="/signup" className="px-2 underline text-gray-700">
              회원가입
            </Link>
          </div>
        </div>

        <div className="flex items-center my-4 w-[600px] mx-auto">
          <hr className="flex-grow border-t border-gray-200" />
          <span className="mx-4 text-gray-500">또는</span>
          <hr className="flex-grow border-t border-gray-200" />
        </div>

        <button
          type="button"
          className="relative bg-[#fee500] flex mt-5 mx-auto p-3 pl-12 w-[20rem] rounded-full items-center justify-center"
        >
          <svg
            className="absolute left-6 w-6 h-6"
            width="25px"
            height="25px"
            viewBox="0 0 512 512"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#000000"
              d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"
            ></path>
          </svg>
          <span className="text-md font-semibold text-gray-800">
            카카오로 3초 만에 시작하기
          </span>
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
