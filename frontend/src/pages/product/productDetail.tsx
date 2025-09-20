import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiHeart } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
import { GoX } from "react-icons/go";
import Category from "./productCategory";
import { ClipLoader } from "react-spinners";
import useLoginStore from "../../stores/useLoginStore";
import fetchApi from "../../api";

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
  product_id: number;
  product_name: string;
  price: number;
  options?: ProductOption[];
  images?: string[];
  seller?: {
    seller_id: number;
    seller_name: string;
    profile_image?: string;
  };
}

interface SelectedCombo {
  options: { [key: string]: ProductOptionValue };
  quantity: number;
}

const fetchProductById = async (id: string): Promise<Product> => {
  const { data: product } = await fetchApi.get(`/api/products/${id}`);
  const { data: images } = await fetchApi.get(`/api/productImages/${id}`);
  return {
    ...product,
    images: images.map((img: any) => img.image),
    seller: {
      seller_id: product.seller_id,
      seller_name: product.seller_name,
      profile_image: product.profile_image,
    },
  };
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user_id } = useLoginStore();
  const isLoggedIn = Boolean(user_id);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  // 옵션 선택 상태 저장
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: ProductOptionValue;
  }>({});

  // 선택 완료된 옵션 조합 리스트 (옵션 + 수량)
  const [selectedCombinations, setSelectedCombinations] = useState<
    SelectedCombo[]
  >([]);

  // 옵션 선택 시 호출: 옵션 저장 후, 모든 옵션이 선택되면 조합 추가
  const handleOptionChange = (optionName: string, valueLabel: string) => {
    const option = product?.options?.find((o) => o.name === optionName);
    const value = option?.values.find((v) => v.label === valueLabel);
    if (!value) return;

    const updated = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(updated);

    const allSelected =
      product?.options?.every((opt) => updated[opt.name]) ?? false;

    if (allSelected) {
      const newCombo: SelectedCombo = {
        options: updated,
        quantity: 1,
      };
      setSelectedCombinations((prev) => [...prev, newCombo]);
      setSelectedOptions({});
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    setSelectedCombinations((prev) => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty > 0) copy[index].quantity = newQty;
      return copy;
    });
  };

  const removeCombination = (index: number) => {
    setSelectedCombinations((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotalPrice = () => {
    return selectedCombinations.reduce((total, combo) => {
      const base = product?.price || 0;
      const extra = Object.values(combo.options).reduce(
        (sum, val) => sum + val.price,
        0
      );
      return total + (base + extra) * combo.quantity;
    }, 0);
  };

  const handleCartClick = () => {
    if (!product || selectedCombinations.length === 0) return;

    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    const cartItems = selectedCombinations.map((combo) => ({
      product,
      options: combo.options,
      quantity: combo.quantity,
    }));

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...existingCart, ...cartItems];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    alert("장바구니에 추가되었습니다");
    navigate("/cart");
  };

  const handleDirectBuy = () => {
    if (!product || selectedCombinations.length === 0) return;

    localStorage.setItem(
      "directBuy",
      JSON.stringify({
        product,
        combinations: selectedCombinations,
        totalPrice: calculateTotalPrice(),
      })
    );
    navigate("/pay");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-20">
        <ClipLoader color="#9CA3AF" size={26} />
      </div>
    );

  if (error || !product) return <p>Product not found or error occurred.</p>;

  return (
    <>
      <div className="dark:text-white flex justify-center px-4 mt-20">
        <div className="w-[768px] flex gap-4">
          <div className="w-[500px] h-[550px]">
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-[512px] px-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-md text-gray-700 dark:text-gray-300">
              <img
                src={product.seller?.profile_image || "/placeholder.png"}
                alt={product.seller?.seller_name}
                className="w-9 h-9 rounded-full"
              />
              <span className="font-medium">{product.seller?.seller_name}</span>{" "}
            </div>

            <div className="flex justify-between items-center">
              <h2 className="mb-2 text-xl">{product.product_name}</h2>
              <div className="flex gap-2 ml-auto">
                <FiHeart className="text-2xl" />
                <IoShareSocialOutline className="text-2xl ml-2" />
              </div>
            </div>

            <p className="text-xl font-semibold mt-2">
              {product.price.toLocaleString()}
              <span className="font-light">원</span>
            </p>
            <hr className="mt-2" />

            <select className="border p-2 text-lg w-full h-[4rem] mt-2 text-orange-500 rounded-lg">
              <option>할인 쿠폰 받기</option>
              <option>첫구매 20% 할인 쿠폰</option>
              <option>즐겨찾기 할인 쿠폰 1000원</option>
            </select>

            <p className="mt-4">
              배송정보 <span className="ml-8">무료 배송</span>
            </p>
            <p className="mt-2">
              도착예정 <span className="ml-8">도착 확률 95%</span>
            </p>
            <p className="mt-2 text-gray-400">
              *배송 출발 이후 배송 기간은 2-3일 소요됩니다
            </p>

            <div className="dark:bg-gray-600 mt-4 border bg-[#fefefe] rounded-lg px-4 py-2">
              {product.options?.map((option) => (
                <div key={option.name} className="mt-2 mb-1">
                  <label htmlFor={`select-${option.name}`} className="text-lg">
                    {option.label}
                  </label>
                  <select
                    id={`select-${option.name}`}
                    className="dark:bg-gray-300 border bg-[#f3f3f3] text-lg rounded-lg px-2 w-full h-[3rem] text-gray-700 mb-2"
                    value={selectedOptions[option.name]?.label || ""}
                    onChange={(e) =>
                      handleOptionChange(option.name, e.target.value)
                    }
                  >
                    <option value="">선택하세요</option>
                    {option.values.map((value) => (
                      <option key={value.label} value={value.label}>
                        {value.label}
                        {value.price > 0
                          ? ` (+${value.price.toLocaleString()}원)`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {selectedCombinations.map((combo, index) => {
                const combinationText = product?.options
                  ?.map((opt) => {
                    const value = combo.options[opt.name];
                    return `${opt.label}: ${value?.label}`;
                  })
                  .join(" / ");

                const extraPrice = Object.values(combo.options).reduce(
                  (sum, val) => sum + val.price,
                  0
                );
                const unitPrice = (product?.price || 0) + extraPrice;
                const totalPrice = unitPrice * combo.quantity;

                return (
                  <div
                    key={`${combinationText}-${index}`}
                    className="border rounded p-3 mt-4 bg-white dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-center">
                      <p>{combinationText}</p>
                      <button
                        aria-label="삭제"
                        onClick={() => removeCombination(index)}
                        className="text-red-500 text-xl hover:underline"
                      >
                        <GoX />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="수량 감소"
                          onClick={() => updateQuantity(index, -1)}
                          className="px-3 py-1 border rounded"
                        >
                          -
                        </button>
                        <span className="text-lg">{combo.quantity}</span>
                        <button
                          aria-label="수량 증가"
                          onClick={() => updateQuantity(index, 1)}
                          className="px-3 py-1 border rounded"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300">
                        {totalPrice.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                );
              })}

              {selectedCombinations.length > 0 && (
                <p className="text-right text-xl font-bold mt-6">
                  총 금액: {calculateTotalPrice().toLocaleString()}원
                </p>
              )}
            </div>

            <div className="mt-3 flex z-[1] gap-4">
              <button
                onClick={handleCartClick}
                className="flex-1 rounded-lg bg-white dark:bg-gray-600 text-black dark:text-white border h-[4rem] font-semibold hover:opacity-90 transition"
              >
                장바구니
              </button>
              <button
                onClick={handleDirectBuy}
                className="flex-1 rounded-lg bg-orange-500 text-white border h-[4rem] font-semibold hover:opacity-90 transition"
              >
                바로 구매
              </button>
            </div>
          </div>
        </div>
      </div>

      <Category product={product} />
    </>
  );
};

export default ProductDetailPage;
