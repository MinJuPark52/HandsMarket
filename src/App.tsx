import React, { useState, useEffect } from "react";
import Nav from "./components/Nav.tsx";
import Footer from "./components/Footer.tsx";
import Products from "./components/Products.tsx";
import Slide from "./components/Slide.tsx";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Nav isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
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
