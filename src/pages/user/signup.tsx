import React from "react";
import { useNavigate } from "react-router-dom";
import useSignupStore from "../../stores/signupStore";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SignupPage = () => {
  const {
    id,
    password,
    passwordAgain,
    nickname,
    emailDomain,
    error,
    setField,
    setError,
    resetError,
  } = useSignupStore();

  const navigate = useNavigate();

  const loginSubmit = async (e: any) => {
    e.preventDefault();

    if (!id) {
      setError("이메일: 필수 정보입니다.");
    } else if (!password) {
      setError("비밀번호: 필수 정보입니다.");
    } else if (!passwordAgain) {
      setError("비밀번호 재입력이 필요합니다.");
    } else if (password !== passwordAgain) {
      setError("비밀번호가 일치하지 않습니다.");
    } else if (!nickname) {
      setError("닉네임: 필수 정보입니다.");
    } else {
      resetError();
      const fullEmail = `${id}${emailDomain}`;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          fullEmail,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: nickname,
        });

        alert("회원가입을 완료했습니다.");
        navigate("/");
      } catch (error: any) {
        setError(`회원가입 오류: ${error.message}`);
      }
    }
  };

  return (
    <div className="mt-[4rem]">
      <form
        onSubmit={loginSubmit}
        className="mx-auto w-full max-w-[1024px] text-center my-[10px] py-4"
      >
        <div className="w-full max-w-[600px] mx-auto text-left">
          <div className="dark:text-white text-sm no-underline mb-4">
            <h1 className="text-3xl font-semibold dark:text-white">SignUp</h1>
          </div>
        </div>

        <div>
          <input
            className="w-[420px] h-[50px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:outline-none"
            placeholder="이메일"
            type="text"
            value={id}
            onChange={(e) => setField("id", e.target.value)}
          />
          <span className="p-2 mx-2 dark:text-white">@</span>
          <select
            className="p-2 h-[50px] my-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:outline-none"
            value={emailDomain}
            onChange={(e) => setField("emailDomain", e.target.value)}
          >
            <option value="@gmail.com">gmail.com</option>
            <option value="@naver.com">naver.com</option>
            <option value="@outlook.com">outlook.com</option>
            <option value="@daum.com">daum.com</option>
          </select>
        </div>
        <div>
          <input
            className="w-[600px] h-[50px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:outline-none"
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setField("password", e.target.value)}
          />
        </div>
        <div>
          <input
            className="w-[600px] h-[50px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:outline-none"
            placeholder="비밀번호 재입력"
            type="password"
            value={passwordAgain}
            onChange={(e) => setField("passwordAgain", e.target.value)}
          />
        </div>
        <div>
          <input
            className="w-[600px] h-[50px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:outline-none"
            placeholder="닉네임"
            type="text"
            value={nickname}
            onChange={(e) => setField("nickname", e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <button
          className="mt-2 w-[600px] h-[50px] p-3 bg-orange-500 text-white text-base rounded-md cursor-pointer hover:bg-orange-600"
          type="submit"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
