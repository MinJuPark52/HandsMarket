import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";
import { IoSearchSharp } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  image?: string;
  description?: string;
}

const fetchProducts = async (keyword: string): Promise<Product[]> => {
  const res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("검색 API 호출 실패");
  return res.json();
};

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const queryParams = useQueryParams();
  const navigate = useNavigate();

  const initialSearchTerm = queryParams.get("query")?.trim() || "";
  const initialSort = queryParams.get("sort") || "default";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortMethod, setSortMethod] = useState(initialSort);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products", searchTerm],
    queryFn: () => fetchProducts(searchTerm),
    enabled: !!searchTerm,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("query", searchTerm.trim());
    if (sortMethod !== "default") params.set("sort", sortMethod);
    navigate(`/searchresult?${params.toString()}`);
  };

  const sortedProducts = useMemo(() => {
    if (!products) return [];

    switch (sortMethod) {
      case "price-asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  }, [products, sortMethod]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-20">
        <BeatLoader color="#9CA3AF" size={13} margin={3} />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center mt-20">
        <MdErrorOutline color="#9CA3AF" size={24} />
        <span className="ml-2 text-gray-600">에러가 발생했습니다.</span>
      </div>
    );

  return (
    <div className="w-[768px] mx-auto mt-6">
      {/* 검색창 */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-b border-orange-400 p-2 flex-grow text-gray-600 outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="border-b border-orange-400 text-orange-500 px-4 text-xl"
        >
          <IoSearchSharp />
        </button>
      </div>

      <div className="flex items-center justify-between mr-4 py-2">
        {products && (
          <p className="text-gray-700 font-medium">
            "{searchTerm}" 검색 결과 {sortedProducts.length}건
          </p>
        )}

        <select
          id="sort"
          value={sortMethod}
          onChange={(e) => {
            const newSort = e.target.value;
            setSortMethod(newSort);

            const params = new URLSearchParams();
            if (searchTerm.trim()) params.set("query", searchTerm.trim());
            if (newSort !== "default") params.set("sort", newSort);
            navigate(`/searchresult?${params.toString()}`);
          }}
        >
          <option value="default">인기순</option>
          <option value="latest">최신순</option>
          <option value="best-sellers">판매수 많은순</option>
          <option value="price-asc">가격 낮은순</option>
          <option value="price-desc">가격 높은순</option>
        </select>
      </div>

      {/* 결과 리스트 */}
      {sortedProducts.length === 0 ? (
        <p className="text-gray-500 mt-4">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {sortedProducts.map((product) => (
            <div key={product.product_id} className="rounded-lg p-2 shadow">
              <img
                src={product.image}
                alt={product.product_name}
                className="h-[150px] w-full object-cover mb-2"
              />
              <p className="text-lg font-medium">{product.product_name}</p>
              <p>{product.price.toLocaleString("ko-KR")}원</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
