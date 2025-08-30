import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { IoSearchSharp } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";

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

  const initialSearchTerm =
    queryParams.get("query")?.toLowerCase().trim() || "";
  const initialSort = queryParams.get("sort") || "default";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortMethod, setSortMethod] = useState(initialSort);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("query", searchTerm.trim());
    if (sortMethod !== "default") params.set("sort", sortMethod);
    navigate(`/searchresult?${params.toString()}`);
  };

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

  if (error)
    return (
      <div className="flex justify-center items-center mt-20">
        <MdErrorOutline color="#9CA3AF" size={24} />
        <span className="ml-2 text-gray-600">에러가 발생했습니다.</span>
      </div>
    );

  return (
    <div className="w-[1024px] mx-auto mt-6">
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
            "{searchTerm}" 검색 결과 {filteredProducts.length}건
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
      {filteredProducts.length === 0 ? (
        ``
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
