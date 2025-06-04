import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const signupSchema = z
  .object({
    id: z.string().min(1, "이메일을 입력해주세요"),
    emailDomain: z.enum([
      "@gmail.com",
      "@naver.com",
      "@outlook.com",
      "@daum.com",
    ]),
    password: z
      .string()
      .min(6, "비밀번호는 최소 6자리 이상이어야 합니다")
      .max(12, "비밀번호는 최대 12자리입니다")
      .regex(
        /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "비밀번호는 소문자, 숫자, 특수문자를 포함해야 합니다"
      ),
    passwordAgain: z.string().min(1, "비밀번호 재입력을 입력해주세요"),
    nickname: z.string().min(1, "닉네임을 입력해주세요"),
  })
  .refine((data) => data.password === data.passwordAgain, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordAgain"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"user" | "seller">("user"); // 🔹 회원 타입 상태

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      emailDomain: "@gmail.com",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    const fullEmail = `${data.id}${data.emailDomain}`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        fullEmail,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.nickname,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        nickname: data.nickname,
        userType,
        profileImage:
          "https://i.postimg.cc/Lm0s77wn/kanhaiya-sharma-z59f-D2-V4-HA-unsplash.jpg",
        createdAt: serverTimestamp(),
      });

      alert("회원가입을 완료했습니다.");
      navigate("/");
    } catch (error: any) {
      alert(`회원가입 오류: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="mt-[4rem]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-[1024px] text-center my-[10px] py-4"
      >
        <div className="w-full max-w-[600px] mx-auto text-left mb-4">
          <h1 className="text-3xl font-semibold dark:text-white">SignUp</h1>
        </div>

        <div className="w-[600px] mx-auto flex justify-center mb-6 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setUserType("user")}
            className={`w-1/2 py-3 text-lg font-medium ${
              userType === "user"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400"
            }`}
          >
            일반 회원
          </button>
          <button
            type="button"
            onClick={() => setUserType("seller")}
            className={`w-1/2 py-3 text-lg font-medium ${
              userType === "seller"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400"
            }`}
          >
            판매자
          </button>
        </div>

        <div className="flex items-center justify-center mb-2">
          <input
            className="w-[420px] h-[50px] p-2 border border-gray-300 rounded-md text-base focus:border-gray-500 focus:outline-none"
            placeholder="이메일"
            type="text"
            {...register("id")}
          />
          <span className="p-2 mx-2 dark:text-white">@</span>
          <select
            className="p-2 h-[50px] border border-gray-300 rounded-md text-base focus:border-gray-500 focus:outline-none"
            {...register("emailDomain")}
          >
            <option value="@gmail.com">gmail.com</option>
            <option value="@naver.com">naver.com</option>
            <option value="@outlook.com">outlook.com</option>
            <option value="@daum.com">daum.com</option>
          </select>
        </div>
        {errors.id && (
          <p className="text-red-500 text-sm mb-1">{errors.id.message}</p>
        )}
        {errors.emailDomain && (
          <p className="text-red-500 text-sm mb-1">
            {errors.emailDomain.message}
          </p>
        )}

        <div>
          <input
            className="w-[600px] h-[50px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-gray-500 focus:outline-none"
            placeholder="비밀번호"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <input
            className="w-[600px] h-[50px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-gray-500 focus:outline-none"
            placeholder="비밀번호 재입력"
            type="password"
            {...register("passwordAgain")}
          />
          {errors.passwordAgain && (
            <p className="text-red-500 text-sm">
              {errors.passwordAgain.message}
            </p>
          )}
        </div>

        <div>
          <input
            className="w-[600px] h-[50px] p-2 my-2 border border-gray-300 rounded-md text-base focus:border-gray-500 focus:outline-none"
            placeholder="닉네임"
            type="text"
            {...register("nickname")}
          />
          {errors.nickname && (
            <p className="text-red-500 text-sm">{errors.nickname.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="mt-2 w-[600px] h-[50px] p-3 bg-orange-500 text-white text-base rounded-md cursor-pointer hover:bg-orange-600 disabled:opacity-50"
          type="submit"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
