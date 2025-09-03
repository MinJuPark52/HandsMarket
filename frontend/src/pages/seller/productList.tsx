import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { FiMoreVertical } from "react-icons/fi";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  authorId: string;
  tags: string[];
  options: {
    label: string;
    name: string;
    values: {
      label: string;
      price: number;
    }[];
  }[];
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "product"));
      const productData: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(productData);
    } catch (error) {
      console.error("상품 목록 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (productId: string) => {
    setDropdownOpenId((prev) => (prev === productId ? null : productId));
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "product", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = (productId: string) => {
    navigate(`/productform/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <BeatLoader color="#9CA3AF" size={13} margin={3} />
      </div>
    );
  }

  return (
    <div className="w-[768px] mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-4">등록한 상품</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">등록된 상품이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex border rounded-lg p-4 gap-4 items-start transition relative"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-40 h-40 object-cover rounded"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {product.title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {product.price.toLocaleString()}원
                    </p>
                    <div className="text-sm text-gray-500 mt-2">
                      태그: {product.tags?.join(", ") || "-"}
                    </div>
                  </div>

                  {/* 드롭다운 토글 버튼 */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(product.id)}
                      className="text-gray-500 px-2 py-1"
                    >
                      <FiMoreVertical size={20} />
                    </button>

                    {/* 드롭다운 메뉴 */}
                    {dropdownOpenId === product.id && (
                      <div className="absolute right-3 bg-white border rounded shadow-md z-10 text-sm">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="px-4 py-2 hover:bg-gray-50 whitespace-nowrap"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-4 py-2 text-red-500 hover:bg-gray-50 whitespace-nowrap"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
