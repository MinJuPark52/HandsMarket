import { useState, useEffect } from "react";
import { FaRegTrashCan } from "react-icons/fa6";

interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

const Cart = () => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartWithQuantity = savedCart.map((item: Product) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCart(cartWithQuantity);
  }, []);

  const handleRemoveFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id: number, delta: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="dark:text-white min-h-screen flex justify-center px-4 mt-[5rem]">
      <div className="w-[1020px] mt-2">
        {cart.length > 0 && (
          <h1 className="text-2xl font-semibold mb-2">장바구니</h1>
        )}
        {cart.length > 0 ? (
          <div>
            {cart.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center p-4 border-b"
              >
                <div className="flex items-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-[6rem] w-auto object-contain mr-4"
                  />
                  <div>
                    <p className="text-xl font-semibold">{product.title}</p>
                    <p className="text-lg">${product.price}</p>
                  </div>

                  {/* 카운트 */}
                  <div className="flex items-center space-x-6 ml-[3rem]">
                    <button
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="px-2 py-1 bg-gray-200 dark:bg-slate-500 rounded"
                    >
                      -
                    </button>
                    <span className="text-lg">{product.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="px-2 py-1 bg-gray-200 dark:bg-slate-500 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveFromCart(product.id)}
                  className="text-red-500"
                >
                  <FaRegTrashCan className="w-[22px] h-auto" />
                </button>
              </div>
            ))}
            <div className="mt-4 text-right">
              <p className="text-xl font-semibold">총 금액: ${totalAmount}</p>
            </div>
          </div>
        ) : (
          <p className="dark:text-white mt-[2rem] col-span-3 text-center text-lg">
            장바구니에 담긴 상품이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default Cart;
