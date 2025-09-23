import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { MdErrorOutline } from "react-icons/md";
import fetchApi from "../../api";

interface Product {
  product_id: string;
  product_name: string;
  price: number;
  thumbnailUrl?: string;
}

interface Props {
  categoryId?: number | null;
  home: boolean;
  best: boolean;
}

const fetchProducts = async (
  categoryId?: number | null,
  home: boolean = false,
  best: boolean = false
): Promise<Product[]> => {
  let url = "/api/products";
  const params = new URLSearchParams();

  if (home) params.append("home", "1");
  if (best) params.append("best", "1");
  if (!home && !best && categoryId !== null && categoryId !== undefined) {
    params.append("category_id", categoryId.toString());
  }

  if ([...params].length > 0) url += `?${params.toString()}`;

  const { data } = await fetchApi.get(url);

  const productsWithImages = await Promise.all(
    data.map(async (product: Product) => {
      try {
        const res = await fetchApi.get(
          `/api/productImages/${product.product_id}`
        );
        return { ...product, thumbnailUrl: res.data[0]?.url || "" };
      } catch {
        return { ...product, thumbnailUrl: "" };
      }
    })
  );

  return productsWithImages;
};

const Products: React.FC<Props> = ({ categoryId, home, best }) => {
  const {
    data: productList,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products", categoryId, home, best],
    queryFn: () => fetchProducts(categoryId, home, best),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-20">
        <ClipLoader color="#9CA3AF" size={26} />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center mt-1">
        <MdErrorOutline color="#9CA3AF" size={24} />
        <span className="ml-2 text-gray-600">에러가 발생했습니다.</span>
      </div>
    );

  if (!productList || productList.length === 0)
    return <p className="text-center text-gray-600 mt-1">제품이 없습니다.</p>;

  return (
    <div className="flex justify-center">
      <div className="mt-2 mx-auto w-full min-w-[600px] max-w-[768px]">
        <h1 className="text-xl mb-4 mt-2 font-medium">방금 등록된 아이템</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {productList.map((product: Product) => (
            <div
              key={product.product_id}
              className="flex flex-col bg-white rounded-lg relative"
            >
              <Link to={`/product/${product.product_id}`}>
                <img
                  src={product.thumbnailUrl || "/no-image.png"}
                  alt={product.product_name}
                  className="h-[150px] w-full mb-1 object-cover rounded-t-lg"
                />
              </Link>

              <p className="px-2 pt-1 text-left text-lg dark:text-black truncate overflow-hidden whitespace-nowrap">
                {product.product_name}
              </p>

              <p className="px-2 pb-1 text-left font-semibold text-lg dark:text-black mb-2">
                {product.price.toLocaleString("ko-KR")}원
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
