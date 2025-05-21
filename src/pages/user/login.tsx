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
        className="mx-auto w-full max-w-[1024px] my-[10px] p-12 w-[100%] text-center"
        onSubmit={loginSubmit}
      >
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
          className="mt-2 w-[600px] p-3 bg-blue-500 text-white text-base rounded-md cursor-pointer hover:bg-blue-700"
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
