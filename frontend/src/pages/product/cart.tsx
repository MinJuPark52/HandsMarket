import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { FaBasketShopping } from "react-icons/fa6";

interface ProductOptionValue {
  label: string;
  price: number;
}

interface ProductOption {
  name: string;
  label: string;
  values: ProductOptionValue[];
}

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  options?: ProductOption[];
}

interface CartItem {
  product: Product;
  options: { [key: string]: ProductOptionValue };
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempOptions, setTempOptions] = useState<{
    [key: string]: ProductOptionValue;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const calculateItemTotal = (item: CartItem) => {
    const optionPrice = Object.values(item.options).reduce(
      (sum, opt) => sum + opt.price,
      0
    );
    return (item.product.price + optionPrice) * item.quantity;
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (editingIndex === index) {
      setEditingIndex(null);
      setTempOptions(null);
    }
  };

  const handleCheckout = () => {
    localStorage.setItem(
      "directBuy",
      JSON.stringify({
        product: cartItems.map((item) => item.product),
        combinations: cartItems,
        totalPrice: calculateTotalPrice(),
      })
    );
    navigate("/pay");
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setTempOptions({ ...cartItems[index].options });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setTempOptions(null);
  };

  const saveOptions = (index: number) => {
    if (!tempOptions) return;
    const updatedCart = [...cartItems];
    updatedCart[index].options = tempOptions;
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setEditingIndex(null);
    setTempOptions(null);
  };

  const handleOptionChange = (
    optionName: string,
    value: ProductOptionValue
  ) => {
    if (!tempOptions) return;
    setTempOptions({ ...tempOptions, [optionName]: value });
  };

  return (
    <div className="mt-20 w-full flex justify-center dark:text-white">
      <div className="w-full max-w-[768px]">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-gray-600 dark:text-gray-400">
            <div className="text-5xl mb-4">
              <FaBasketShopping />
            </div>
            <p className="text-xl">장바구니가 비어 있습니다.</p>
          </div>
        ) : (
          <>
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="mb-6 p-4 border rounded dark:bg-gray-800 bg-white relative flex gap-4"
              >
                {/* 삭제 버튼 오른쪽 위 */}
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="absolute top-3 right-3 text-xl text-gray-400 dark:text-gray-300"
                  aria-label="삭제"
                >
                  <FiX />
                </button>

                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-32 h-32 object-cover rounded"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="py-1 text-lg font-semibold">
                      {item.product.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300 py-1">
                      {Object.values(item.options)
                        .map((val) => val.label)
                        .join(" / ")}
                    </p>

                    <div className="py-1 text-gray-400">{item.quantity}개</div>

                    {/* 옵션 변경 UI */}
                    {editingIndex === index ? (
                      <div className="mt-2 p-3 border rounded bg-gray-50 dark:bg-gray-800">
                        {item.product.options?.map((opt) => (
                          <div key={opt.name} className="mb-2">
                            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                              {opt.label}
                            </label>
                            <select
                              className="w-full rounded border px-2 py-1 dark:bg-gray-800 dark:border-gray-600"
                              value={
                                tempOptions ? tempOptions[opt.name]?.label : ""
                              }
                              onChange={(e) => {
                                const selected = opt.values.find(
                                  (v) => v.label === e.target.value
                                );
                                if (selected)
                                  handleOptionChange(opt.name, selected);
                              }}
                            >
                              {opt.values.map((val) => (
                                <option key={val.label} value={val.label}>
                                  {val.label}{" "}
                                  {val.price > 0 ? `(+${val.price}원)` : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                        <div className="flex gap-3 justify-end mt-2">
                          <button
                            onClick={cancelEditing}
                            className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-200 dark:border-gray-500 dark:hover:bg-gray-600"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => saveOptions(index)}
                            className="px-4 py-2 rounded bg-orange-500 text-white hover:opacity-90"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <button
                          onClick={() => startEditing(index)}
                          className="text-sm border border-gray-300 px-2 py-1 text-gray-700 dark:text-gray-300"
                        >
                          옵션 변경
                        </button>
                        <div className="mt-2 text-lg font-bold">
                          {calculateItemTotal(item).toLocaleString()}원
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleCheckout}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 max-w-xl w-full"
              >
                총 {calculateTotalPrice().toLocaleString()}원 구매하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
