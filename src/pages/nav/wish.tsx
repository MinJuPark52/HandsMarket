import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
}

const WishList = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (id: number) => {
    const updatedWishlist = wishlist.filter((product) => product.id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div className="dark:text-white min-h-screen flex justify-center px-4 mt-[5rem]">
      <div className="max-w-[1020px] mt-2">
        {wishlist.length > 0 && (
          <h1 className="text-2xl mb-6 mt-2 font-semibold">찜한 상품</h1>
        )}
        <div className="grid grid-cols-[repeat(4,_1fr)] gap-2">
          {wishlist.length > 0 ? (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex flex-col bg-white dark:bg-gray-900 p-2 rounded-md relative border border-gray-200 dark:border-gray-600"
              >
                <button
                  className="absolute top-2 right-2 text-xl text-gray-500 dark:text-gray-300"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  &times;
                </button>

                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-[200px] w-auto mb-4 object-contain mx-auto"
                  />
                </Link>
                <p className="text-left font-semibold">{product.title}</p>
                <p className="text-left dark:text-white">
                  {product.description}
                </p>
                <p className="text-left font-semibold">${product.price}</p>
              </div>
            ))
          ) : (
            <p className="dark:text-white mt-[2rem] col-span-3 text-center text-lg">
              찜한 상품이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishList;
