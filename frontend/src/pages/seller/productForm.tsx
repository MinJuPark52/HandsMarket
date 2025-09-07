import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface OptionValue {
  label: string;
  price: number;
}

interface OptionGroup {
  label: string;
  name: string;
  values: OptionValue[];
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product_id?: string;
}

interface Tag {
  id: string;
  name: string;
}

const ProductForm = ({ product_id }: ProductFormProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [detailImage, setDetailImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [detailImagePreview, setDetailImagePreview] = useState<string | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [options, setOptions] = useState<OptionGroup[]>([
    {
      label: "사이즈",
      name: "size",
      values: [{ label: "소형: 10~12송이", price: 0 }],
    },
  ]);

  // 상품 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      if (!product_id) return;

      try {
        const { data } = await axios.get(`/api/products/${product_id}`);
        setProductName(data.product_name || "");
        setPrice(data.price || 0);
        setTags(data.tags || []);
        setOptions(data.options || []);
        setMainImagePreview(data.imageUrl || "");
        setDetailImagePreview(data.detailImageUrl || "");
        setSelectedCategory(data.category_id?.toString() || "");
      } catch (err) {
        console.error("상품 로딩 실패:", err);
      }
    };

    fetchProduct();
  }, [product_id]);

  // 카테고리 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0].id);
      } catch (err) {
        console.error("카테고리 로딩 실패:", err);
      }
    };

    const fetchTags = async () => {
      try {
        const { data } = await axios.get("/api/tags");
        setAllTags(data);
      } catch (error) {
        console.error("태그 로딩 실패:", error);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  // 이미지 미리보기 처리
  useEffect(() => {
    if (mainImage) {
      const url = URL.createObjectURL(mainImage);
      setMainImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [mainImage]);

  useEffect(() => {
    if (detailImage) {
      const url = URL.createObjectURL(detailImage);
      setDetailImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [detailImage]);

  // 옵션 그룹, 옵션 값 핸들러
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

  // const addOptionGroup = () => {
  //   setOptions([
  //     ...options,
  //     { label: "", name: "", values: [{ label: "", price: 0 }] },
  //   ]);
  // };

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

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mainImage && !mainImagePreview) {
      alert("대표 이미지를 업로드해주세요.");
      return;
    }
    if (!detailImage && !detailImagePreview) {
      alert("상세 이미지를 업로드해주세요.");
      return;
    }

    if (!productName || !price) {
      alert("상품명과 가격은 필수입니다.");
      return;
    }

    try {
      let savedProductId = product_id;

      if (!product_id) {
        const res = await axios.post(
          "/api/products",
          {
            product_name: productName,
            price,
            category_id: selectedCategory,
            options,
            tags,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        savedProductId = res.data.product_id;
      } else {
        await axios.put(
          `/api/products/${product_id}`,
          {
            product_name: productName,
            price,
            category_id: selectedCategory,
            options,
            tags,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (mainImage || detailImage) {
        const formData = new FormData();
        formData.append("product_id", savedProductId!);
        if (mainImage) formData.append("thumbnail", mainImage);
        if (detailImage) formData.append("image", detailImage);

        await axios.post("/api/productImages", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      alert(product_id ? "상품 수정 완료" : "상품 등록 완료");
      navigate("/");

      if (!product_id) {
        setProductName("");
        setPrice(0);
        setTags([]);
        setMainImage(null);
        setDetailImage(null);
        setMainImagePreview(null);
        setDetailImagePreview(null);
        setOptions([
          {
            label: "사이즈",
            name: "size",
            values: [{ label: "소형: 10~12송이", price: 0 }],
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      alert("상품 등록/수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-[768px] mx-auto mt-20 space-y-5">
      <h1 className="text-xl font-bold text-gray-800">
        {product_id ? "상품 수정" : "상품 등록"}
      </h1>

      <div className="space-y-5">
        {/* 상품 정보 */}
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 border-b pb-2">
          상품 기본 정보
        </h3>

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            상품명
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none dark:text-gray-600"
            placeholder="상품명을 입력해주세요"
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
            placeholder="판매가를 입력해주세요"
          />
        </div>

        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 border-b pb-2">
          태그 선택
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {allTags.map((tag) => {
            const isSelected = tags.includes(tag.id);
            return (
              <label
                key={tag.id}
                className={`cursor-pointer rounded border px-4 py-2 text-center select-none 
            ${
              isSelected
                ? "text-orange-400 border-orange-400"
                : "border-gray-200 hover:bg-gray-50"
            }`}
              >
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={isSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      if (tags.length < 3) {
                        setTags([...tags, tag.id]);
                      } else {
                        alert("태그는 최대 3개까지 선택 가능합니다.");
                        e.preventDefault();
                      }
                    } else {
                      setTags(tags.filter((id) => id !== tag.id));
                    }
                  }}
                  className="hidden"
                />
                <span>{tag.name}</span>
              </label>
            );
          })}
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 border-b pb-2">
            카테고리
          </h3>
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="inline-flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={selectedCategory === cat.id}
                  onChange={() => setSelectedCategory(cat.id)}
                  className="form-radio text-orange-500"
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 이미지 업로드 */}
        <section>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 border-b pb-2">
            상품 이미지
          </h3>
          <div className="flex space-x-2">
            {/* 메인 이미지 */}
            <div className="w-40">
              <label className="block mb-2 text-gray-600 dark:text-gray-300">
                대표 이미지
              </label>
              <label
                htmlFor="main-upload"
                className="relative w-32 h-32 flex items-center justify-center bg-gray-100 border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:border-orange-300 transition"
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
                className="relative w-32 h-32 flex items-center justify-center bg-gray-100 border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:border-orange-300 transition"
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
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            상품 옵션
          </h3>
          {options.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-2"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                <input
                  type="text"
                  placeholder="옵션명 (예: 색상)"
                  value={group.label}
                  onChange={(e) =>
                    handleOptionGroupChange(groupIndex, "label", e.target.value)
                  }
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-gray-200"
                />
                <input
                  type="text"
                  placeholder="옵션 코드명 (예: color)"
                  value={group.name}
                  onChange={(e) =>
                    handleOptionGroupChange(groupIndex, "name", e.target.value)
                  }
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-gray-200"
                />
                <button
                  onClick={() => removeOptionGroup(groupIndex)}
                  className="text-orange-500 border border-orange-300 px-4 py-2 rounded hover:text-orange-500 hover:border-orange-500 transition-colors"
                >
                  삭제
                </button>
              </div>

              {group.values.map((value, valueIndex) => (
                <div
                  key={valueIndex}
                  className="flex flex-col md:flex-row md:items-center gap-4 mb-3"
                >
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
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-gray-200"
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
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeOptionValue(groupIndex, valueIndex)}
                    className="text-orange-500 border border-orange-300 px-4 py-2 rounded hover:text-orange-500 hover:border-orange-500 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addOptionValue(groupIndex)}
                className="text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-5 py-2 rounded transition"
              >
                + 옵션 값 추가
              </button>
            </div>
          ))}
        </section>

        {/* 제출 */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-orange-500 text-white py-3 rounded-lg w-full hover:bg-orange-600 transition"
          >
            {product_id ? "상품 수정하기" : "상품 등록하기"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
