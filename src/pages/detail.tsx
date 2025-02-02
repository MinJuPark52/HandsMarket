import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoShareSocialOutline } from "react-icons/io5";

interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
}

const ProducDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    fetch(`/products.json`)
      .then((response) => response.json())
      .then((data) => {
        const productDetail = data.find(
          (item: Product) => item.id === Number(id)
        );
        setProduct(productDetail || null);
      })
      .catch((error) => console.error("Error loading product data:", error));
  }, [id]);

  const handleBuyClick = () => {
    setShowOptions(true);
  };

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="max-w-[1020px] mt-2">
        <div className="flex ">
          <img
            src={product.image}
            alt={product.title}
            className="h-[30rem] w-auto object-contain"
          />
        </div>

        <div className="w-[37.5rem] h-auto p-4 flex flex-col">
          <div className="flex justify-between items-center">
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
            <select className="border px-2 w-[36rem] h-[3rem] mt-2 text-blue-500">
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

          <div>
            <button
              onClick={handleBuyClick}
              className="bg-gray-800 text-white border px-2 w-[36rem] h-[3rem] mt-4"
            >
              구매하기
            </button>
          </div>

          {showOptions && (
            <>
              <div>
                <select className="w-[36rem] h-[3rem] text-gray-700">
                  <option>색상</option>
                  <option>블랙</option>
                  <option>네이비</option>
                  <option>화이트</option>
                </select>
              </div>
              <div>
                <select className="w-[36rem] h-[3rem] mt-2 text-gray-700">
                  <option>사이즈</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProducDetailPage;
