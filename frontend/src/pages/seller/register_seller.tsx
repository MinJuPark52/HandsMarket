import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ProductFormProps {
  productId?: string;
}

const RegistSeller = ({ productId }: ProductFormProps) => {
  const navigate = useNavigate();
  const [sellerName, setSellerName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!productId) return;

    const fetchSeller = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/sellers/${productId}`
        );
        setSellerName(res.data.seller_name || "");
        setProfileImagePreview(res.data.profile_image || null);
      } catch (err) {
        console.error("판매자 정보 불러오기 실패:", err);
      }
    };

    fetchSeller();
  }, [productId]);

  useEffect(() => {
    if (profileImage) {
      const previewUrl = URL.createObjectURL(profileImage);
      setProfileImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [profileImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = Boolean(productId);
    const url = isEdit
      ? `http://localhost:3000/sellers/${productId}`
      : `http://localhost:3000/sellers`;

    try {
      const formData = new FormData();
      formData.append("sellerName", sellerName);
      if (profileImage) formData.append("profileImage", profileImage);

      const res = await axios({
        method: isEdit ? "patch" : "post",
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);

      alert(
        isEdit ? "판매자 정보가 수정되었습니다." : "판매자가 등록되었습니다."
      );
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "서버 오류");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[768px] mx-auto mt-20">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">정보 관리</h2>
      <section>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mt-4 mb-1">
            프로필 사진
          </label>
          <label
            htmlFor="profile-upload"
            className="relative w-28 h-28 flex items-center justify-center bg-gray-100 border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer hover:border-orange-300 transition"
          >
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="프로필 미리보기"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center">
                이미지 업로드
              </span>
            )}
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mt-4 mb-1">
              판매자명
            </label>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none dark:text-gray-600"
              placeholder="판매자 또는 브랜드 이름"
            />
          </div>
        </div>
      </section>

      <div className="text-right mt-6">
        <button
          type="submit"
          className="bg-orange-500 text-white py-3 rounded-lg w-full hover:bg-orange-600 transition"
        >
          {productId ? "수정하기" : "판매자 등록하기"}
        </button>
      </div>
    </form>
  );
};

export default RegistSeller;
