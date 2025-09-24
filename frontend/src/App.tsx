import { useState, useEffect } from "react";
import Footer from "./components/home/Footer";
import Products from "./components/home/Products";
import Slide from "./components/home/Slide";
import HomeCategory from "./components/home/HomeCategory";
import fetchApi from "./api";

interface Category {
  id?: number;
  name: string;
  type?: "home" | "best";
}

const App = () => {
  const fixedCategories: Category[] = [
    { name: "홈", type: "home" },
    { name: "베스트", type: "best" },
  ];
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [homeFilter, setHomeFilter] = useState<boolean>(false);
  const [bestFilter, setBestFilter] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await fetchApi.get("/api/categories");
        setDbCategories(data);
      } catch (err) {
        console.error("카테고리 불러오기 실패:", err);
      }
    };
    fetchCategories();
  }, []);

  const categories: Category[] = [...fixedCategories, ...dbCategories];

  const handleSelect = (category: Category) => {
    if (category.type === "home") {
      setSelectedCategoryId(null);
      setHomeFilter(true);
      setBestFilter(false);
    } else if (category.type === "best") {
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
