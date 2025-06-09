import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { BeatLoader } from "react-spinners";
import { MdErrorOutline } from "react-icons/md";

interface Product {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "product")); // 'product' 컬렉션에서 데이터를 가져옴
  const products: Product[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
  return products;
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-20">
        <BeatLoader color="#9CA3AF" size={13} margin={3} />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center mt-20">
        <MdErrorOutline color="#9CA3AF" size={24} />
        <span className="ml-2 text-gray-600">에러가 발생했습니다.</span>
      </div>
    );

  if (!productList || productList.length === 0)
    return <p className="text-center text-lg">제품이 없습니다.</p>;

  return (
    <div className="flex justify-center">
      <div className="mt-2 mx-auto w-full min-w-[600px] max-w-[1024px]">
        <h1 className="text-xl mb-4 mt-2 font-medium">방금 등록된 아이템</h1>
        <div className="grid grid-cols-[repeat(4,_1fr)] gap-4">
          {productList.map((product: Product) => (
            <div
              key={product.id}
              className="flex flex-col bg-white rounded-lg relative"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-[150px] w-full mb-1 object-cover rounded-t-lg"
                />
              </Link>

              <p className="px-2 pt-1 text-left text-lg dark:text-black truncate overflow-hidden whitespace-nowrap">
                {product.title}
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
