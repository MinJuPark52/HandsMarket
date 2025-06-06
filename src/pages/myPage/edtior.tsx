import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuth, updateProfile, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const profileSchema = z
  .object({
    nickname: z.string().min(1, "닉네임을 입력해주세요"),
    password: z
      .string()
      .min(6, "비밀번호는 최소 6자리 이상이어야 합니다")
      .max(12, "비밀번호는 최대 12자리입니다")
      .regex(
        /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "비밀번호는 소문자, 숫자, 특수문자를 포함해야 합니다"
      )
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;

const EditProfilePage: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setValue("nickname", user.displayName || "");
      setPreviewUrl(user.photoURL || null);
    }
  }, [user, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      let photoURL = user.photoURL;

      if (imageFile) {
        const imageRef = ref(storage, `profile_images/${user.uid}`);
        await uploadBytes(imageRef, imageFile);
        photoURL = await getDownloadURL(imageRef);
      }

      await updateProfile(user, {
        displayName: data.nickname,
        photoURL,
      });

      if (data.password && data.password.length >= 6) {
        await updatePassword(user, data.password);
      }

      await updateDoc(doc(db, "users", user.uid), {
        nickname: data.nickname,
        profileImage: photoURL,
      });

      alert("프로필이 성공적으로 수정되었습니다.");
      navigate("/");
    } catch (error: any) {
      console.error("프로필 수정 오류:", error.message);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mt-[4rem] flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[1024px] text-center my-[10px] py-4"
      >
        <div className="w-full max-w-[600px] mx-auto mb-4">
          <h1 className="text-3xl font-semibold dark:text-white text-center">
            프로필 설정
          </h1>
        </div>

        {/* 프로필 이미지 업로드 */}
        <div className="text-center">
          {/* 이미지 클릭 시 파일 선택창 열림 */}
          <label htmlFor="profileImage" className="inline-block cursor-pointer">
            <img
              src={previewUrl || "https://i.postimg.cc/QM7WLTv0/img.png"}
              alt="미리보기"
              className="w-32 h-32 rounded-full object-cover border border-gray-300"
              title="프로필 사진 클릭하여 변경"
            />
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* 닉네임 입력 */}
        <div>
          <input
            className="w-[600px] h-[50px] p-2 my-2 border border-gray-300 rounded-md focus:outline-none"
            placeholder="닉네임"
            type="text"
            {...register("nickname")}
          />
          {errors.nickname && (
            <p className="text-red-500 text-sm">{errors.nickname.message}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <input
            className="w-[600px] h-[50px] p-2 my-2 border border-gray-300 rounded-md focus:outline-none"
            placeholder="새 비밀번호"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* 비밀번호 재확인 */}
        <div>
          <input
            className="w-[600px] h-[50px] p-2 mb-2 border border-gray-300 rounded-md focus:outline-none"
            placeholder="비밀번호 재확인"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          disabled={isSubmitting}
          className="mt-2 w-[600px] h-[50px] p-3 bg-orange-500 text-white text-base rounded-md cursor-pointer hover:bg-orange-600 disabled:opacity-50"
          type="submit"
        >
          수정
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
