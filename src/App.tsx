import Footer from "./components/UI/Footer";
import Products from "./components/UI/Products";
import Slide from "./components/UI/Slide";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="mt-20">
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
