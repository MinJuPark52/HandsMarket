import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
}

const Products = () => {
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) => {
        setProductList(data);
      })
      .catch((error) => console.error("Error loading product data:", error));
  }, []);

  const handleAddToWishlist = (product: Product) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wishlist.find((item: Product) => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    alert("🤍 찜한 상품에 추가했습니다");
  };

  const currentProducts = productList.slice();

  return (
    <div className="min-h-screen flex justify-center px-4">
      <div className="max-w-[1020px] mt-2">
        <h1 className="text-2xl mb-6 mt-2 font-semibold">
          회원님을 위한 추천 상품
        </h1>
        <div className="grid grid-cols-[repeat(4,_1fr)] gap-2">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col bg-white dark:bg-gray-900 p-2 rounded-md relative border border-gray-200 dark:border-gray-600"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-[200px] w-auto mb-4 object-contain mx-auto"
                  />
                </Link>
                <i
                  className="text-2xl text-black dark:text-white cursor-pointer absolute bottom-[6rem] right-[1rem] hover:text-red-500"
                  onClick={() => handleAddToWishlist(product)}
                >
                  <FiHeart />
                </i>
                <p className="text-left font-semibold">{product.title}</p>
                <p className="text-left dark:text-white">
                  {product.description}
                </p>
                <p className="text-left font-semibold">${product.price}</p>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-lg">
              Loading products...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
