import Footer from "./components/home/Footer";
import Products from "./components/home/Products";
import Slide from "./components/home/Slide";
import HomeCategory from "./components/home/HomeCategory";

const categories = [
  { id: 1, name: "홈" },
  { id: 2, name: "베스트" },
  { id: 3, name: "지역 상품" },
  { id: 4, name: "핸드메이드" },
];

const App = () => {
  const handleSelect = (category: { id: number; name: string }) => {};

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
