import { useState, useEffect } from "react";
import { db, storage } from "../../firebase/firebaseConfig";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

interface OptionValue {
  label: string;
  price: number;
}

interface OptionGroup {
  label: string;
  name: string;
  values: OptionValue[];
}

interface ProductFormProps {
  productId?: string;
}

const ProductForm = ({ productId }: ProductFormProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [authorName, setAuthorName] = useState("");
  const [tags, setTags] = useState<string>("");

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [detailImage, setDetailImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [detailImagePreview, setDetailImagePreview] = useState<string | null>(
    null
  );
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  const [options, setOptions] = useState<OptionGroup[]>([
    {
      label: "사이즈",
      name: "size",
      values: [{ label: "소형: 10~12송이", price: 0 }],
    },
  ]);

  const authorId = "author_015";

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const productRef = doc(db, "product", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const data = productSnap.data();
          setTitle(data.title || "");
          setPrice(data.price || 0);
          setTags((data.tags || []).join(", "));
          setOptions(data.options || []);
          setMainImagePreview(data.image || "");

          const authorRef = doc(db, "authors", data.authorId);
          const authorSnap = await getDoc(authorRef);
          if (authorSnap.exists()) {
            const author = authorSnap.data();
            setAuthorName(author.name || "");
            setDetailImagePreview(author.detailImages || "");
            setProfileImagePreview(author.profileImage || "");
          }
        }
      } catch (err) {
        console.error("상품 로딩 실패:", err);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (mainImage) {
      const previewUrl = URL.createObjectURL(mainImage);
      setMainImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [mainImage]);

  useEffect(() => {
    if (detailImage) {
      const previewUrl = URL.createObjectURL(detailImage);
      setDetailImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [detailImage]);

  useEffect(() => {
    if (profileImage) {
      const previewUrl = URL.createObjectURL(profileImage);
      setProfileImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [profileImage]);

  const handleOptionGroupChange = (
    index: number,
    field: "label" | "name",
    value: string
  ) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleOptionValueChange = (
    groupIndex: number,
    valueIndex: number,
    field: "label" | "price",
    value: string | number
  ) => {
    const newOptions = [...options];
    if (field === "price") {
      newOptions[groupIndex].values[valueIndex][field] = Number(value);
    } else {
      newOptions[groupIndex].values[valueIndex][field] = value as string;
    }
    setOptions(newOptions);
  };

  const addOptionGroup = () => {
    setOptions([
      ...options,
      { label: "", name: "", values: [{ label: "", price: 0 }] },
    ]);
  };

  const removeOptionGroup = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const addOptionValue = (groupIndex: number) => {
    const newOptions = [...options];
    newOptions[groupIndex].values.push({ label: "", price: 0 });
    setOptions(newOptions);
  };

  const removeOptionValue = (groupIndex: number, valueIndex: number) => {
    const newOptions = [...options];
    newOptions[groupIndex].values = newOptions[groupIndex].values.filter(
      (_, i) => i !== valueIndex
    );
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = Boolean(productId);
    const id = isEdit ? productId! : uuidv4();

    if (!mainImage && !mainImagePreview) {
      alert("대표 이미지를 업로드해주세요.");
      return;
    }
    if (!detailImage && !detailImagePreview) {
      alert("상세 이미지를 업로드해주세요.");
      return;
    }

    try {
      let mainImageUrl = mainImagePreview || "";
      if (mainImage) {
        const mainImageRef = ref(storage, `products/${id}/main`);
        await uploadBytes(mainImageRef, mainImage);

        // [Troubleshooting: CORS Error]
        // Firebase Storage 버킷 경로가 잘못되어 있어서 에러 발생.
        mainImageUrl = await getDownloadURL(mainImageRef);
        setMainImagePreview(mainImageUrl);
      }

      let detailImageUrl = detailImagePreview || "";
      if (detailImage) {
        const detailImageRef = ref(storage, `authors/${authorId}/detail`);
        await uploadBytes(detailImageRef, detailImage);
        detailImageUrl = await getDownloadURL(detailImageRef);
        setDetailImagePreview(detailImageUrl);
      }

      let profileImageUrl = profileImagePreview || "";
      if (profileImage) {
        const profileImageRef = ref(storage, `authors/${authorId}/profile`);
        await uploadBytes(profileImageRef, profileImage);
        profileImageUrl = await getDownloadURL(profileImageRef);
        setProfileImagePreview(profileImageUrl);
      }

      await setDoc(doc(db, "authors", authorId), {
        name: authorName,
        profileImage: profileImageUrl,
        detailImages: detailImageUrl,
      });

      const productData = {
        title,
        price,
        image: mainImageUrl,
        authorId,
        tags: tags.split(",").map((tag) => tag.trim()),
        options,
      };

      if (isEdit) {
        await updateDoc(doc(db, "product", id), productData);
        alert("상품이 성공적으로 수정되었습니다!");
      } else {
        await setDoc(doc(db, "product", id), productData);
        alert("상품이 성공적으로 등록되었습니다!");
      }

      navigate("/");

      if (!isEdit) {
        setTitle("");
        setPrice(0);
        setAuthorName("");
        setTags("");
        setMainImage(null);
        setDetailImage(null);
        setProfileImage(null);
        setMainImagePreview(null);
        setDetailImagePreview(null);
        setProfileImagePreview(null);
        setOptions([
          {
            label: "사이즈",
            name: "size",
            values: [{ label: "소형: 10~12송이", price: 0 }],
          },
        ]);
      }
    } catch (err) {
      console.error("상품 등록/수정 실패:", err);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[1024px] mx-auto mt-20 space-y-5"
    >
      <h1 className="text-3xl font-bold text-gray-800">
        {productId ? "상품 수정" : "상품 등록"}
      </h1>

      <div className="shadow-sm rounded-lg p-8 space-y-10 border border-gray-200">
        {/* 상품 정보 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 border-b pb-2">
            상품 기본 정보
          </h2>

          {/* 프로필 이미지 */}
          <div className="w-40 mb-4">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              프로필
            </label>
            <label
              htmlFor="profile-upload"
              className="relative w-32 h-32 flex items-center justify-center bg-gray-100 border-2 border-dashed rounded-full overflow-hidden cursor-pointer hover:border-blue-400 transition"
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
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                상품명
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none dark:text-gray-600"
                placeholder="예: 레드로즈 부케"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                판매가
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none dark:text-gray-600"
                placeholder="예: 32000"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                판매자명
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none dark:text-gray-600"
                placeholder="판매자 또는 브랜드 이름"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                태그
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none dark:text-gray-600"
                placeholder="예: 꽃, 부케, 로즈 (쉼표로 구분)"
              />
            </div>
          </div>
        </section>

        {/* 이미지 업로드 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 border-b pb-2">
            상품 이미지
          </h2>
          <div className="flex space-x-6">
            {/* 메인 이미지 */}
            <div className="w-40">
              <label className="block mb-2 text-gray-600 dark:text-gray-300">
                대표 이미지
              </label>
              <label
                htmlFor="main-upload"
                className="relative w-40 h-40 flex items-center justify-center bg-gray-100 border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:border-blue-400 transition"
              >
                {mainImagePreview ? (
                  <img
                    src={mainImagePreview}
                    alt="메인 미리보기"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center">
                    이미지 업로드
                  </span>
                )}
              </label>
              <input
                id="main-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>

            {/* 상세 이미지 */}
            <div className="w-40">
              <label className="block mb-2 text-gray-600 dark:text-gray-300">
                상세 이미지
              </label>
              <label
                htmlFor="detail-upload"
                className="relative w-40 h-40 flex items-center justify-center bg-gray-100 border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:border-blue-400 transition"
              >
                {detailImagePreview ? (
                  <img
                    src={detailImagePreview}
                    alt="상세 미리보기"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center">
                    이미지 업로드
                  </span>
                )}
              </label>
              <input
                id="detail-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setDetailImage(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
          </div>
        </section>

        {/* 옵션 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 border-b pb-2">
            상품 옵션
          </h2>
          {options.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="text"
                  placeholder="옵션명 (예: 색상)"
                  value={group.label}
                  onChange={(e) =>
                    handleOptionGroupChange(groupIndex, "label", e.target.value)
                  }
                  className="flex-1 border rounded px-2 py-2 focus:outline-none dark:text-gray-600"
                />
                <input
                  type="text"
                  placeholder="옵션 코드명 (예: color)"
                  value={group.name}
                  onChange={(e) =>
                    handleOptionGroupChange(groupIndex, "name", e.target.value)
                  }
                  className="flex-1 border rounded px-2 py-2 focus:outline-none dark:text-gray-600"
                />
                <button
                  onClick={() => removeOptionGroup(groupIndex)}
                  className="text-red-400 border-red-400 border px-3 py-2 rounded"
                >
                  삭제
                </button>
              </div>
              {group.values.map((value, valueIndex) => (
                <div key={valueIndex} className="flex items-center gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="옵션 값"
                    value={value.label}
                    onChange={(e) =>
                      handleOptionValueChange(
                        groupIndex,
                        valueIndex,
                        "label",
                        e.target.value
                      )
                    }
                    className="flex-1 border rounded p-2 focus:outline-none dark:text-gray-600"
                  />
                  <input
                    type="number"
                    placeholder="가격 추가"
                    value={value.price}
                    onChange={(e) =>
                      handleOptionValueChange(
                        groupIndex,
                        valueIndex,
                        "price",
                        Number(e.target.value)
                      )
                    }
                    className="flex-1 border rounded p-2 focus:outline-none dark:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeOptionValue(groupIndex, valueIndex)}
                    className="text-red-400 border-red-400 border px-3 py-2 rounded"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOptionValue(groupIndex)}
                className="text-md text-blue-500"
              >
                + 옵션 값 추가
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOptionGroup}
            className="text-gray-600 border bg-gray-50 px-4 py-2 rounded"
          >
            + 옵션 그룹 추가
          </button>
        </section>

        {/* 제출 */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-orange-500 text-white py-3 rounded-lg w-full hover:bg-orange-600 transition"
          >
            {productId ? "상품 수정하기" : "상품 등록하기"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
