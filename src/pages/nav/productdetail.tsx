import { useState } from "react";
import { useParams } from "react-router-dom";
import { IoShareSocialOutline } from "react-icons/io5";
import { FiHeart } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

interface ProductOptionValue {
  label: string;
  price: number;
}

interface ProductOption {
  name: string;
  label: string;
  values: ProductOptionValue[];
}

interface Product {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  options?: ProductOption[];
}

const fetchProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, "product", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as Partial<Product>;

    return {
      id: docSnap.id,
      image: data.image ?? "",
      title: data.title ?? "",
      description: data.description ?? "",
      price: Number(data.price ?? 0),
      options: data.options ?? [],
    };
  }

  return null;
};

const ProducDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: ProductOptionValue;
  }>({});

  const handleOptionChange = (optionName: string, valueLabel: string) => {
    const option = product?.options?.find((o) => o.name === optionName);
    const value = option?.values.find((v) => v.label === valueLabel);
    if (value) {
      setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
    }
  };

  const calculateTotalPrice = () => {
    const basePrice = product?.price || 0;
    const extra = Object.values(selectedOptions).reduce(
      (sum, opt) => sum + opt.price,
      0
    );
    return basePrice + extra;
  };

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const handleBuyClick = () => setShowOptions(true);

  const handleCartClick = () => {
    if (!product) return;

    const isLoggedIn = Boolean(localStorage.getItem("userToken"));
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const isProductInCart = existingCart.some(
      (item: Product) => item.id === product.id
    );

    if (!isProductInCart) {
      existingCart.push(product);
      localStorage.setItem("cart", JSON.stringify(existingCart));
      alert("장바구니에 추가되었습니다");
    }

    navigate("/cart");
  };

  if (isLoading) return <p>Loading product...</p>;
  if (error || !product) return <p>Product not found or error occurred.</p>;

  return (
    <div className="dark:text-white min-h-screen flex justify-center px-4 mt-20">
      <div className="w-[1024x] flex gap-2">
        <div className="w-[500px] h-[600px]">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-[512px] p-4 flex flex-col">
          <div className="w-full h-auto flex justify-between items-center">
            <h2 className="mb-2 text-xl">{product.title}</h2>
            <div className="flex gap-2 ml-auto">
              <FiHeart className="text-2xl" />
              <IoShareSocialOutline className="text-2xl ml-2" />
            </div>
          </div>

          <p>{product.description}</p>
          <p className="text-xl font-semibold mt-2">
            {product.price}
            <span className="font-light">원</span>
          </p>
          <hr className="mt-2" />

          <div>
            <select className="border p-2 text-lg w-full h-[4rem] mt-2 text-orange-500 rounded-lg">
              <option className="text-gray-700">할인 쿠폰 받기</option>
              <option className="text-gray-700">첫구매 20% 할인 쿠폰</option>
              <option className="text-gray-700">
                즐겨찾기 할인 쿠폰 1000원
              </option>
            </select>
          </div>
          <p className="mt-4 text-md">
            <span>배송정보</span>
            <span className="ml-8">무료 배송</span>
          </p>

          <p className="mt-2 text-md">
            <span>도착예정</span>
            <span className="ml-8">도착 확률 95%</span>
            <p className="mt-2 text-gray-400">
              *배송 출발 이후 배송 기간은 2-3일 소요됩니다
            </p>
          </p>

          {showOptions && (
            <div className="dark:bg-gray-500 mt-4 border bg-[#fefefe] rounded-lg px-4 ">
              {product.options?.map((option) => (
                <div key={option.name} className="mt-2">
                  <p className="mt-4 mb-1 text-lg">{option.label}</p>
                  <select
                    className="dark:bg-gray-300 border bg-[#f3f3f3] text-lg rounded-lg px-2 w-full h-[3rem] text-gray-700"
                    value={selectedOptions[option.name]?.label || ""}
                    onChange={(e) =>
                      handleOptionChange(option.name, e.target.value)
                    }
                  >
                    <option value="">선택하세요</option>
                    {option.values.map((value) => (
                      <option key={value.label} value={value.label}>
                        {value.label}{" "}
                        {value.price > 0
                          ? `(+${value.price.toLocaleString()}원)`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <hr className="mt-6" />
              <p className="dark:text-gray-800 text-right mt-2 text-2xl font-bold">
                총 {calculateTotalPrice().toLocaleString()}원
              </p>
            </div>
          )}

          <div className="mt-4 flex z-[1] gap-4">
            {showOptions ? (
              <>
                <button
                  onClick={handleCartClick}
                  className="flex-1 rounded-lg bg-white dark:bg-gray-600 text-black dark:text-white border h-[4rem] font-semibold hover:opacity-90 transition"
                >
                  장바구니
                </button>
                <button className="flex-1 rounded-lg bg-orange-500 text-white border h-[4rem] font-semibold hover:opacity-90 transition">
                  바로 구매
                </button>
              </>
            ) : (
              <button
                onClick={handleBuyClick}
                className="w-full rounded-lg bg-orange-500 text-white border h-[4rem] font-semibold hover:opacity-90 transition"
              >
                구매하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducDetailPage;
