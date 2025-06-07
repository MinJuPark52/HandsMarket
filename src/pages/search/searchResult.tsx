import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";

interface Product {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "product"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const queryParams = useQueryParams();
  const navigate = useNavigate();

  // URL에서 초기 검색어 가져오기
  const initialSearchTerm =
    queryParams.get("query")?.toLowerCase().trim() || "";
  const initialSort = queryParams.get("sort") || "default";

  // 로컬 상태로 검색어 관리 (검색창에 검색어 남기기 위해)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortMethod, setSortMethod] = useState(initialSort);

  // 상품 데이터 fetch
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // 검색 버튼 클릭 시 URL 쿼리 파라미터 업데이트
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("query", searchTerm.trim());
    if (sortMethod !== "default") params.set("sort", sortMethod);
    navigate(`/searchresult?${params.toString()}`);
  };

  // 정렬 함수
  const sortProducts = (items: Product[], method: string) => {
    switch (method) {
      case "price-asc":
        return [...items].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...items].sort((a, b) => b.price - a.price);
      default:
        return items;
    }
  };

  // 필터링 및 정렬된 결과
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    if (!searchTerm) return sortProducts(products, sortMethod);

    const searchWords = searchTerm.toLowerCase().split(/\s+/);

    const filtered = products.filter((product) => {
      const title = product.title.toLowerCase();
      return searchWords.every((word) => title.includes(word));
    });

    return sortProducts(filtered, sortMethod);
  }, [products, searchTerm, sortMethod]);

  // URL 쿼리 변경에 따른 상태 동기화
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
    setSortMethod(initialSort);
  }, [initialSearchTerm, initialSort]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-20">
        <BeatLoader color="#9CA3AF" size={13} margin={3} />
      </div>
    );
  if (error) return <p>Error loading products</p>;

  return (
    <div className="w-[1024px] mx-auto mt-4">
      {/* 검색창 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 flex-grow"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          검색
        </button>
      </div>

      <div className="flex items-center justify-between py-2">
        {/* 상품 개수 */}
        {products && (
          <p className="text-gray-700 font-medium">
            상품 {filteredProducts.length}
          </p>
        )}

        {/* 정렬 선택 */}
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
      {filteredProducts.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="rounded-lg p-2 shadow">
              <img
                src={product.image}
                alt={product.title}
                className="h-[150px] w-full object-cover mb-2"
              />
              <p className="text-lg font-medium">{product.title}</p>
              <p>{product.price.toLocaleString("ko-KR")}원</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
