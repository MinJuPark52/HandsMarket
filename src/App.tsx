import Footer from "./components/home/Footer";
import Products from "./components/home/Products";
import Slide from "./components/home/Slide";
import HomeCategory from "./components/home/HomeCategory";

const categories = [
  { id: 1, name: "패션", icon: "👗" },
  { id: 2, name: "전자기기", icon: "📱" },
  { id: 3, name: "가구", icon: "🛋️" },
  { id: 4, name: "뷰티", icon: "💄" },
];

const App = () => {
  const handleSelect = (category: {
    id: number;
    name: string;
    icon: string;
  }) => {
    alert(`선택된 카테고리: ${category.name}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="mt-20">
        <HomeCategory categories={categories} onSelect={handleSelect} />
      </div>
      <div className="mt-4">
        <Slide />
      </div>
      <div className="mt-2">
        <Products />
      </div>
      <Footer />
    </div>
  );
};

export default App;
