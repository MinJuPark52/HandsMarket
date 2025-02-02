import { useState, useEffect } from "react";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Login from "./pages/login.tsx";
import Signup from "./pages/signup.tsx";
import Cart from "./pages/cart.tsx";
import Search from "./pages/search.tsx";
import ProductDetail from "./pages/detail.tsx";
import Nav from "./components/Nav.tsx";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // 브라우저의 다크 모드 기본 설정을 감지하여 상태를 업데이트
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
    }
  }, []);

  // 다크 모드 상태가 변경되면 HTML 엘리먼트에 클래스 추가/삭제
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <Router>
      {/* Nav에 다크 모드 상태와 상태 변경 함수 전달 */}
      <Nav isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
};

root.render(<Index />);
