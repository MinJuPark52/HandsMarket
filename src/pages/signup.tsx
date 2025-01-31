import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [loginState, setLoginState] = useState({
    id: "",
    password: "",
    passwordAgain: "",
    nickname: "",
    error: "",
  });
  const navigate = useNavigate();

  const setError = (field: any, value: any) => {
    setLoginState((prev) => ({ ...prev, [field]: value }));
  };

  const loginSubmit = (e: any) => {
    e.preventDefault();
    const { id, password, passwordAgain, nickname } = loginState;

    if (!id) {
      setError("error", "아이디: 필수 정보입니다.");
    } else if (!password) {
      setError("error", "비밀번호: 필수 정보입니다.");
    } else if (!passwordAgain) {
      setError("error", "비밀번호 재확인이 필요합니다.");
    } else if (password !== passwordAgain) {
      setError("error", "비밀번호가 일치하지 않습니다.");
    } else if (!nickname) {
      setError("error", "닉네임: 필수 정보입니다.");
    } else {
      setError("error", "");
      console.log("가입 정보:", { id, password, nickname });
      alert("회원가입을 완료했습니다.");
      navigate("/");
    }
  };

  return (
    <div className="join-container">
      <form onSubmit={loginSubmit} className="p-12 w-[90%] text-center">
        <h1 className="text-3xl font-medium">Sign Up</h1>
        <br />
        <div>
          <input
            className="peer w-[600px] p-2 my-2 border border-gray-300 rounded-md text-base transition-all duration-300 ease-in-out focus:border-blue-500 focus:outline-none focus:placeholder:text-sm placeholder:text-base placeholder:transition-all placeholder:duration-300"
            placeholder="아이디"
            type="text"
            value={loginState.id}
            onChange={(e) => setError("id", e.target.value)}
          />
        </div>
        <div>
          <input
            className="peer w-[600px] p-2 my-2 border border-gray-300 rounded-md text-base transition-all duration-300 ease-in-out focus:border-blue-500 focus:outline-none focus:placeholder:text-sm placeholder:text-base placeholder:transition-all placeholder:duration-300"
            placeholder="비밀번호"
            type="password"
            value={loginState.password}
            onChange={(e) => setError("password", e.target.value)}
          />
        </div>
        <div>
          <input
            className="peer w-[600px] p-2 my-2 border border-gray-300 rounded-md text-base transition-all duration-300 ease-in-out focus:border-blue-500 focus:outline-none focus:placeholder:text-sm placeholder:text-base placeholder:transition-all placeholder:duration-300"
            placeholder="비밀번호 재확인"
            type="password"
            value={loginState.passwordAgain}
            onChange={(e) => setError("passwordAgain", e.target.value)}
          />
        </div>
        <div>
          <input
            className="peer w-[600px] p-2 my-2 border border-gray-300 rounded-md text-base transition-all duration-300 ease-in-out focus:border-blue-500 focus:outline-none focus:placeholder:text-sm placeholder:text-base placeholder:transition-all placeholder:duration-300"
            placeholder="닉네임"
            type="text"
            value={loginState.nickname}
            onChange={(e) => setError("nickname", e.target.value)}
          />
        </div>
        {loginState.error && (
          <p className="text-red text-sm mt-3">{loginState.error}</p>
        )}
        <button
          className="mt-2 w-[610px] p-3 bg-blue-500 text-white text-base rounded-md cursor-pointer transition-colors duration-300 hover:bg-blue-700"
          type="submit"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
