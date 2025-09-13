import { useState } from "react";
import Footer from "./components/home/Footer";
import Products from "./components/home/Products";
import Slide from "./components/home/Slide";
import HomeCategory from "./components/home/HomeCategory";

const categories = [
  { id: 4, name: "홈" },
  { id: 3, name: "베스트" },
  { id: 2, name: "지역 상품" },
  { id: 1, name: "핸드메이드" },
];

const App = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(4);

  const handleSelect = (category: { id: number; name: string }) => {
    console.log("선택된 카테고리 id:", category.id);
    setSelectedCategoryId(category.id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="mt-16">
        <HomeCategory
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={handleSelect}
        />
      </div>
      <div className="mt-2">
        <Slide />
      </div>
      <div className="mt-2">
        <Products categoryId={selectedCategoryId} />
      </div>
      <Footer />
    </div>
  );
};

export default App;
