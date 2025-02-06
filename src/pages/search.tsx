import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronLeft } from "react-icons/fi";

const SearchPage = () => {
  const keywords: string[] = [
    "캐주얼 오버핏 흑청 자켓",
    "소가죽 메리제인 플랫슈즈",
    "클레어 몰드 스트랩 샌들",
    "베이직 스틸레토힐",
    "핀덕 스트레이트 일자 팬츠",
    "멀티 포켓 캐주얼 크로스백",
    "미니 토트 크로스백",
    "데일리 포켓 백팩",
    "캐시미어 울 라운드 니트",
    "어바웃 벨트 숄더백",
    "뉴 보부상 숄더백",
    "프리미엄 숏 패딩 점퍼",
    "베이직 라운드 가디건",
  ];

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredKeywords, setFilteredKeywords] = useState<string[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const filtered = keywords.filter((keyword) =>
        keyword.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredKeywords(filtered);
    } else {
      setFilteredKeywords([]);
    }
  };

  const handleSearchSelect = (selectedKeyword: string) => {
    setSearchTerm(selectedKeyword);
    setFilteredKeywords([]);
    navigate(`/search?query=${selectedKeyword}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bottom-[3rem] relative mt-[3rem]">
      <div className="max-w-[1020px] mx-auto flex items-center p-3">
        <button
          className="mr-4 text-[#626262] text-4xl dark:text-white"
          onClick={handleGoBack}
        >
          <FiChevronLeft />
        </button>
        <div className="flex items-center w-full relative">
          <input
            type="text"
            className="h-[3.5rem] w-full py-3 px-4 rounded-2xl text-base border bg-[#f3f3f3]"
            placeholder="아이템을 검색해보세요"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FiSearch className="absolute right-4 text-[#888] text-xl" />
        </div>
      </div>

      {filteredKeywords.length > 0 && (
        <ul className="max-w-[1020px] mx-auto absolute top-[65px] left-0 right-0 max-h-80 font-semibold text-lg px-2">
          {filteredKeywords.map((keyword, index) => (
            <li
              key={index}
              className="px-4 py-6 ml-5 flex items-center border-b border-[#dddddd]"
              onClick={() => handleSearchSelect(keyword)}
            >
              <FiSearch className="absolute left-3 text-[#888] text-xl" />
              {keyword}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
