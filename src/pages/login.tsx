import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const loginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!id && !password) {
      setError("아이디 또는 비밀번호를 입력해주세요");
    } else if (!id) {
      setError("아이디를 입력해주세요");
    } else if (!password) {
      setError("비밀번호를 입력해주세요");
    } else {
      setError("");
      alert("로그인 되었습니다.");
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <form className="p-12 w-[90%] text-center" onSubmit={loginSubmit}>
        <h1 className="text-3xl font-medium">Login</h1>
        <br />
        <div className="form-group">
          <input
            className="peer w-[600px] p-2 my-2 border border-gray-300 rounded-md text-base transition-all duration-300 ease-in-out focus:border-blue-500 focus:outline-none focus:placeholder:text-sm placeholder:text-base placeholder:transition-all placeholder:duration-300"
            placeholder="아이디"
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            className="peer w-[600px] p-2 my-2 border border-gray-300 rounded-md text-base transition-all duration-300 ease-in-out focus:border-blue-500 focus:outline-none focus:placeholder:text-sm placeholder:text-base placeholder:transition-all placeholder:duration-300"
            placeholder="비밀번호"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red text-sm mt-3">{error}</p>}
        <button
          className="mt-2 w-[610px] p-3 bg-blue-500 text-white text-base rounded-md cursor-pointer transition-colors duration-300 hover:bg-blue-700"
          type="submit"
        >
          로그인
        </button>
        <div className="text-gray-500 text-sm no-underline mt-4 mb-4">
          <span>아직 회원이 아니신가요?</span>
          <Link to="/signup"> 회원가입</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
