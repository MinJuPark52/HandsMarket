import { useState, useEffect } from "react";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import App from "./App.tsx";
import Login from "./pages/user/login.tsx";
import Signup from "./pages/user/signup.tsx";
import Cart from "./pages/nav/cart.tsx";
import Search from "./pages/nav/search.tsx";
import ProductDetail from "./pages/nav/productdetail.tsx";
import Nav from "./components/UI/Nav.tsx";
import Wish from "./pages/nav/wish.tsx";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const Index = () => {
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
    <Router>
      <RoutesWrapper isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </Router>
  );
};

const RoutesWrapper = ({
  isDarkMode,
  setIsDarkMode,
}: {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/search" && (
        <Nav isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      )}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wish" element={<Wish />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );
};

root.render(<Index />);
