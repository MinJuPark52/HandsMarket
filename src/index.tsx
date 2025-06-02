import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import App from "./App";
import AuthListener from "./components/AuthListener";
import Login from "./pages/user/login";
import Signup from "./pages/user/signup";
import Cart from "./pages/nav/cart";
import Search from "./pages/nav/search";
import ProductDetail from "./pages/product/productDetail";
import Nav from "./components/UI/Nav";
import Wish from "./pages/myPage/wish";
import Profile from "pages/myPage/profile";
import Pay from "pages/order/pay";
import ChatRoom from "pages/chat/chatRoom";
import ChatList from "pages/chat/chatList";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthListener />
        <RoutesWrapper isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </Router>
    </QueryClientProvider>
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chatroom/:chatId/:sellerId" element={<ChatRoom />} />
        <Route path="/chatList" element={<ChatList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );
};

root.render(<Index />);
