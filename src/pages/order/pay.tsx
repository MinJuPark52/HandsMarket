import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import OrdererInfo from "./orderInfo";
import Payment from "../order/payment";

const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(10, "전화번호를 입력해주세요"),
  email: z.string().email("이메일 형식이 아닙니다").optional(),
  address: z.string().min(1, "주소를 입력해주세요"),
  request: z.string().optional(),
  payment: z.enum(["card", "bank", "phone"]),
});

export type FormData = z.infer<typeof schema>;

type ProductForPay = {
  name: string;
  options: string;
  quantity: number;
  price: number;
  image?: string;
};

const paymentMethods = ["card", "bank", "phone"] as const;
type PaymentMethod = (typeof paymentMethods)[number];

const Pay: React.FC = () => {
  const [isOrderInfoOpen, setIsOrderInfoOpen] = useState(true);
  const [products, setProducts] = useState<ProductForPay[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      payment: "card",
    },
  });

  useEffect(() => {
    const directBuyRaw = localStorage.getItem("directBuy");
    if (directBuyRaw) {
      const directBuy = JSON.parse(directBuyRaw);
      const combinations = directBuy.combinations;

      if (Array.isArray(combinations) && combinations.length > 0) {
        const newProducts = combinations.map((combo: any, index: number) => {
          const product = Array.isArray(directBuy.product)
            ? directBuy.product[index]
            : directBuy.product;

          const optionNameMap: Record<string, string> = {};
          if (Array.isArray(product.options)) {
            product.options.forEach((opt: any) => {
              optionNameMap[opt.name] = opt.label;
            });
          }

          const optionsText = Object.entries(combo.options || {})
            .map(([key, value]) => {
              const val = value as { label: string };
              const optionName = optionNameMap[key] || key;
              return `${optionName}: ${val.label}`;
            })
            .join(" / ");

          const optionPrice = Object.values(combo.options || {}).reduce(
            (sum: number, opt: any) => sum + (opt?.price || 0),
            0
          );

          const price = (product.price + optionPrice) * (combo.quantity || 1);

          return {
            name: product.title,
            options: optionsText,
            quantity: combo.quantity || 1,
            price,
            image: product.image,
          };
        });

        setProducts(newProducts);
      } else {
        const baseProduct = Array.isArray(directBuy.product)
          ? directBuy.product[0]
          : directBuy.product;

        setProducts([
          {
            name: baseProduct.title,
            options: "",
            quantity: 1,
            price: directBuy.totalPrice,
            image: baseProduct.image,
          },
        ]);
      }
    } else {
      setProducts([]);
    }
  }, []);

  const validateForm = (): boolean => {
    if (!watch("name")) {
      alert("주문자 이름을 입력해주세요.");
      return false;
    }
    if (!watch("phone")) {
      alert("연락처를 입력해주세요.");
      return false;
    }
    const email = watch("email");
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      alert("이메일을 입력해주세요.");
      return false;
    }
    if (!watch("address")) {
      alert("유효한 배송지를 입력해주세요.");
      return false;
    }
    return true;
  };

  const onSubmit = (data: FormData) => {
    alert("주문 완료!\n" + JSON.stringify(data, null, 2));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[1024px] mx-auto mt-20"
    >
      <div className="flex gap-6">
        {/* 왼쪽 영역 - 2/3 */}
        <div className="w-2/3 space-y-10">
          {/* 주문자 정보 */}
          <section>
            <h2
              className="text-xl font-semibold mb-4 flex justify-between items-center cursor-pointer select-none"
              onClick={() => setIsOrderInfoOpen((prev) => !prev)}
            >
              주문자 정보
              <span className="text-3xl text-gray-500">
                {isOrderInfoOpen ? <GoChevronUp /> : <GoChevronDown />}
              </span>
            </h2>
            {isOrderInfoOpen && (
              <OrdererInfo register={register} errors={errors} />
            )}
          </section>

          {/* 주문 상품 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">주문 상품</h2>
            <div className="space-y-2 border px-3 rounded-lg">
              {products.length === 0 && <p>상품이 없습니다.</p>}
              {products.map((product, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start border-b py-2 last:border-none"
                >
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md mb-2"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.options} {product.quantity}개
                    </p>
                  </div>
                  <div className="flex items-end mt-14">
                    <p className="text-xl font-semibold whitespace-nowrap">
                      {product.price.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 결제 수단 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">결제 수단</h2>
            <div className="flex justify-between gap-2">
              {paymentMethods.map((method) => {
                const labels: Record<PaymentMethod, string> = {
                  card: "신용/체크카드",
                  bank: "무통장 입금",
                  phone: " 핸드폰 결제",
                };
                const selected = watch("payment") === method;

                return (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setValue("payment", method)}
                    className={`w-1/3 p-4 border rounded-xl text-center transition ${
                      selected ? "border-orange-300" : "hover:bg-gray-100"
                    }`}
                  >
                    {labels[method]}
                  </button>
                );
              })}
            </div>
            {errors.payment && (
              <p className="text-red-500 text-sm mt-2">
                {errors.payment.message}
              </p>
            )}
          </section>
        </div>

        {/* 오른쪽 영역 - 결제 요약 및 버튼 */}
        <div className="w-1/3">
          <Payment
            products={products}
            buyer={{
              name: watch("name"),
              email: watch("email") || "",
              tel: watch("phone"),
              address: watch("address"),
              postcode: "00000",
            }}
            paymentMethod={watch("payment")}
            validateForm={validateForm}
          />
        </div>
      </div>
    </form>
  );
};

export default Pay;
