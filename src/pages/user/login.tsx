import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const loginSubmit = (e: any) => {
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

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,12}$/;
    if (!passwordRegex.test(password)) {
      setError("비밀번호는 특수문자, 대소문자, 숫자를 포함하여 입력해주세요");
      return;
    }

    setError("");
    alert("로그인 되었습니다.");
    navigate("/");
  };

  return (
    <div className="mt-[5rem]">
      <form className="p-12 w-[90%] text-center" onSubmit={loginSubmit}>
        <h1 className="text-3xl font-medium dark:text-white">Login</h1>
        <br />
        <div>
          <input
            className="w-[600px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:outline-none"
            placeholder="이메일"
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div>
          <input
            className="w-[600px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:outline-none"
            placeholder="비밀번호"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <button
          className="mt-2 w-[610px] p-3 bg-blue-500 text-white text-base rounded-md cursor-pointer hover:bg-blue-700"
          type="submit"
        >
          로그인
        </button>
        <div className="dark:text-white text-gray-500 text-sm no-underline mt-4 mb-4">
          <span className="px-2">아직 회원이 아니신가요?</span>
          <Link to="/signup">회원가입</Link>
        </div>
        <hr className="w-[35rem] mx-auto" />

        <button
          type="button"
          className="flex mt-5 mx-auto w-[30rem] p-3 border border-gray-300 rounded-md justify-center bg-white"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGH1sc-aB3eQ_ipx7WbmUQrdgTKtEBBENcsQ&s"
            alt="Facebook logo"
            className="h-6 mr-3"
          />
          Kakao Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
