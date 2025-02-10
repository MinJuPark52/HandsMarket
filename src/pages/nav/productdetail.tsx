import { useState } from "react";
import { useParams } from "react-router-dom";
import { IoShareSocialOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("/products.json");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

const ProducDetailPage = () => {
  const { id } = useParams();
  const [showOptions, setShowOptions] = useState(false);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <p>Loading product...</p>;
  if (error) return <p>Error loading product data.</p>;

  const product = products?.find((item) => item.id === Number(id));
  if (!product) return <p>Product not found.</p>;

  const handleBuyClick = () => setShowOptions(true);

  const handleCartClick = () => {
    if (!product) return;

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const isProductInCart = existingCart.some(
      (item: Product) => item.id === product.id
    );

    if (!isProductInCart) {
      existingCart.push(product);
      localStorage.setItem("cart", JSON.stringify(existingCart));
      alert("장바구니에 추가되었습니다");
    }
  };

  return (
    <div className="dark:text-white min-h-screen flex justify-center px-4 mt-20">
      <div className="w-[1020px] mt-2">
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="h-[30rem] w-auto object-contain"
          />
        </div>

        <div className="p-4 flex flex-col">
          <div className="w-full h-auto flex justify-between items-center">
            <h2 className="mb-2 text-xl font-semibold">{product.title}</h2>
            <IoShareSocialOutline className="text-xl" />
          </div>

          <p>{product.description}</p>
          <p className="text-lg font-semibold mt-2">
            <span>판매가</span>
            <span className="ml-8">$</span>
            {product.price}
            <hr className="mt-2" />
          </p>

          <div>
            <select className="border px-2 w-full h-[4rem] mt-2 text-blue-500">
              <option className="text-gray-700">할인 쿠폰 받기</option>
              <option className="text-gray-700">첫구매 20% 할인 쿠폰</option>
              <option className="text-gray-700">
                즐겨찾기 할인 쿠폰 1000원
              </option>
            </select>
          </div>
          <p className="mt-4">
            <span>배송정보</span>
            <span className="ml-8">무료 배송</span>
          </p>

          <p className="mt-2">
            <span>도착예정</span>
            <span className="ml-8">도착 확률 95%</span>
            <p className="mt-1 text-gray-400">
              *배송 출발 이후 배송 기간은 2-3일 소요됩니다
            </p>
          </p>

          <div className="relative">
            {showOptions && (
              <div className="dark:bg-gray-500 w-[988px] absolute -bottom-[2rem] transform translate-y-[0%] border bg-[#f1f1f1] rounded-lg p-6">
                <div>
                  <p className="mb-1 text-lg">색상</p>
                  <select className="dark:bg-gray-300 border text-lg rounded-lg px-2 w-full h-[3rem] text-gray-700">
                    <option value="">색상을 선택하기</option>
                    <option value="블랙">블랙</option>
                    <option value="네이비">네이비</option>
                    <option value="화이트">화이트</option>
                  </select>
                </div>
                <div className="mt-4">
                  <p className="mb-1 text-lg">사이즈</p>
                  <select className="dark:bg-gray-300 border text-lg rounded-lg px-2 w-full h-[3rem] text-gray-700">
                    <option value="">사이즈를 선택하기</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                  </select>
                </div>
                <hr className="flex mt-[4rem]" />
                <p className="dark:text-gray-800 flex ml-[50rem] mt-[1rem] text-2xl font-bold">
                  총 ${product.price}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex z-[1]">
            {showOptions && (
              <div className="flex">
                <button
                  onClick={handleCartClick}
                  className="rounded-lg dark:bg-gray-600 bg-white text-black dark:text-white border h-[4rem] w-[510px]"
                >
                  장바구니
                </button>
              </div>
            )}
            <button
              onClick={handleBuyClick}
              className={`rounded-lg bg-gray-800 text-white border px-2 h-[4rem] ${
                showOptions ? "ml-2 w-[510px]" : "w-full"
              }`}
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducDetailPage;
