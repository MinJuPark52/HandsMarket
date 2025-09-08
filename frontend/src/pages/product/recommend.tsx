import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BeatLoader } from "react-spinners";

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  images?: string[];
}

interface RecommendProps {
  currentProductId: string;
  tags?: string[];
}

const fetchRecommendedProducts = async (
  currentProductId: string
): Promise<Product[]> => {
  const res = await fetch(`/api/recommend/${currentProductId}`);
  if (!res.ok) throw new Error("Failed to fetch recommended products");
  return res.json();
};

const Recommend: React.FC<RecommendProps> = ({ currentProductId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recommended", currentProductId],
    queryFn: () => fetchRecommendedProducts(currentProductId),
    enabled: !!currentProductId,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-20">
        <BeatLoader color="#9CA3AF" size={13} margin={3} />
      </div>
    );

  if (isError || !data || data.length === 0)
    return <p>추천 상품이 없습니다.</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">다른 고객이 함께 본 상품</h3>
      <ul className="grid grid-cols-4 gap-6">
        {data.map((product) => (
          <li
            key={product.product_id}
            className="cursor-pointer"
            onClick={() =>
              (window.location.href = `/product/${product.product_id}`)
            }
          >
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.product_name}
              className="w-full h-40 object-cover rounded"
            />
            <h4 className="mt-2">{product.product_name}</h4>
            <p className="text-orange-500 font-semibold">
              {product.price.toLocaleString()}원
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommend;
