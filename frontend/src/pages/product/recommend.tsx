import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { BeatLoader } from "react-spinners";

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  tags?: string[];
}

interface RecommendProps {
  tags: string[];
  currentProductId: string;
}

const fetchRecommendedProducts = async (
  tags: string[],
  currentProductId: string
): Promise<Product[]> => {
  if (!tags || tags.length === 0) return [];

  const productsRef = collection(db, "product");
  const q = query(
    productsRef,
    where("tags", "array-contains-any", tags),
    limit(5)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        title: data.title,
        image: data.image,
        price: data.price,
        tags: data.tags,
      };
    })
    .filter((p) => p.id !== currentProductId);
};

const Recommend: React.FC<RecommendProps> = ({ tags, currentProductId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recommended", tags, currentProductId],
    queryFn: () => fetchRecommendedProducts(tags, currentProductId),
    enabled: tags.length > 0,
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
            key={product.id}
            className="cursor-pointer"
            onClick={() => (window.location.href = `/product/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-40 object-cover rounded"
            />
            <h4 className="mt-2">{product.title}</h4>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommend;
