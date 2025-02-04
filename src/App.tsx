import Footer from "./components/Footer.tsx";
import Products from "./components/Products.tsx";
import Slide from "./components/Slide.tsx";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="mt-8">
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
