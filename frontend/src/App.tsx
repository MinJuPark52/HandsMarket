import { useState } from "react";
import Footer from "./components/home/Footer";
import Products from "./components/home/Products";
import Slide from "./components/home/Slide";
import HomeCategory from "./components/home/HomeCategory";

interface Category {
  id?: number;
  name: string;
}

const categories = [
  { name: "홈" },
  { name: "베스트" },
  { id: 2, name: "지역 상품" },
  { id: 1, name: "핸드메이드" },
];

const App = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [homeFilter, setHomeFilter] = useState<boolean>(false);
  const [bestFilter, setBestFilter] = useState<boolean>(false);

  const handleSelect = (category: Category) => {
    if (category.name === "홈") {
      setSelectedCategoryId(null);
      setHomeFilter(true);
      setBestFilter(false);
    } else if (category.name === "베스트") {
      setSelectedCategoryId(null);
      setHomeFilter(false);
      setBestFilter(true);
    } else {
      setSelectedCategoryId(category.id ?? null);
      setHomeFilter(false);
      setBestFilter(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
      <div className="mt-16">
        <HomeCategory
          categories={categories}
          selectedCategoryId={selectedCategoryId ?? -1}
          onSelect={handleSelect}
        />
      </div>
      <div className="mt-2">
        <Slide />
      </div>
      <div className="mt-2">
        <Products
          categoryId={selectedCategoryId}
          home={homeFilter}
          best={bestFilter}
        />
      </div>
      <Footer />
    </div>
  );
};

export default App;
