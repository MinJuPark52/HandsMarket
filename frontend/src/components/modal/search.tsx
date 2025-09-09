import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

interface Product {
  product_id: number;
  product_name: string;
}

interface SearchPageModalProps {
  onClose: () => void;
}

const SearchPageModal: React.FC<SearchPageModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/search?keyword=${encodeURIComponent(searchTerm)}`
        );
        const data: Product[] = await response.json();
        setFilteredProducts(data.slice(0, 5));
      } catch (error) {
        console.error("검색 중 오류 발생:", error);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSelect = (selectedKeyword: string) => {
    window.location.href = `/searchresult?query=${selectedKeyword}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      window.location.href = `/searchresult?query=${searchTerm}`;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black bg-opacity-50 flex items-start justify-center pt-[1rem]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-[768px] rounded-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 검색 입력창 */}
        <div className="flex items-center w-full relative">
          <input
            type="text"
            className="h-[3.5rem] w-full px-6 rounded-lg text-base border bg-gray-100 dark:text-gray-700"
            placeholder="아이템을 검색해보세요"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <FiSearch
            className="absolute right-4 text-gray-700 text-xl cursor-pointer"
            onClick={() =>
              searchTerm.trim() &&
              (window.location.href = `/searchresult?query=${searchTerm}`)
            }
          />
        </div>

        {/* 자동완성 검색 결과 */}
        {filteredProducts.length > 0 && (
          <ul className="max-h-8font-semibold text-lg px-2 bg-white rounded shadow">
            {filteredProducts.map((product) => (
              <li
                key={product.product_id}
                className="px-4 py-4 flex items-center border-b border-gray-100 cursor-pointer hover:bg-gray-50 dark:text-gray-600"
                onClick={() => handleSearchSelect(product.product_name)}
              >
                <FiSearch className="mr-2 text-gray-600 text-xl" />
                {product.product_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPageModal;
