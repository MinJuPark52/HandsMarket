import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("/products.json");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

const Products = () => {
  const {
    data: productList,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const handleAddToWishlist = (product: Product) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wishlist.find((item: Product) => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    alert("🤍 찜한 상품에 추가했습니다");
  };

  if (isLoading)
    return <p className="text-center text-lg">Loading products...</p>;
  if (error)
    return <p className="text-center text-lg">Error loading products.</p>;
  if (!productList || productList.length === 0)
    return <p className="text-center text-lg">No products available.</p>;

  return (
    <div className="min-h-screen flex justify-center px-4">
      <div className="max-w-[1020px] mt-2">
        <h1 className="text-2xl mb-6 mt-2 font-semibold">
          회원님을 위한 추천 상품
        </h1>
        <div className="grid grid-cols-[repeat(4,_1fr)] gap-2">
          {productList.map((product) => (
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
              <p className="text-left dark:text-white">{product.description}</p>
              <p className="text-left font-semibold">${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
