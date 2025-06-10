import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface Product {
  id: string;
  title: string;
}

const fetchProductTitles = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "product"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
  }));
};

interface SearchPageModalProps {
  onClose: () => void;
}

const SearchPageModal: React.FC<SearchPageModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredKeywords, setFilteredKeywords] = useState<string[]>([]);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["productTitles"],
    queryFn: fetchProductTitles,
  });

  useEffect(() => {
    if (!searchTerm || !products) {
      setFilteredKeywords([]);
      return;
    }

    const matches = products
      .map((product) => product.title)
      .filter((title) =>
        title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setFilteredKeywords(matches.slice(0, 5));
  }, [searchTerm, products]);

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
        className="bg-white dark:bg-gray-800 w-[1024px] rounded-lg relative"
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
        {filteredKeywords.length > 0 && (
          <ul className="max-h-8font-semibold text-lg px-2 bg-white rounded shadow">
            {filteredKeywords.map((keyword, index) => (
              <li
                key={index}
                className="px-4 py-4 flex items-center border-b border-gray-100 cursor-pointer hover:bg-gray-50 dark:text-gray-600"
                onClick={() => handleSearchSelect(keyword)}
              >
                <FiSearch className="mr-2 text-gray-600 text-xl" />
                {keyword}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPageModal;
