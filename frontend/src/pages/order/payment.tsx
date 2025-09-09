import React from "react";

declare global {
  interface Window {
    IMP?: any;
  }
}

type Product = {
  product_id: number;
  name: string;
  options?: string;
  quantity: number;
  price: number;
};

type Buyer = {
  customer_name: string;
  contact_phone: string;
  contact_email: string;
  address: string;
};

type PaymentPageProps = {
  products: Product[];
  buyer: Buyer;
  paymentMethod: "card" | "bank" | "phone";
  validateForm: () => boolean;
};

const Payment: React.FC<PaymentPageProps> = ({
  products,
  buyer,
  paymentMethod,
  validateForm,
}) => {
  const totalPrice = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const handlePayment = () => {
    if (!validateForm()) {
      return;
    }

    const paymentLabels = {
      card: "신용/체크카드",
      bank: "무통장 입금",
      phone: "핸드폰 결제",
    } as const;

    if (paymentMethod !== "card") {
      alert(`"${paymentLabels[paymentMethod]}"는 아직 지원하지 않습니다.`);
      return;
    }

    // 아임포트 모듈과 가맹점 코드 가져오기
    const { IMP } = window;
    const merchantCode = process.env.REACT_APP_PORTONE_MERCHANT_ID;

    if (!IMP || !merchantCode) return;

    IMP.init(merchantCode); // 아임포트 초기화

    // 결제 요청 정보 구성
    const paymentData = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: `mid_${Date.now()}`,
      name: products[0]?.name || "상품",
      amount: totalPrice,
      buyer_email: buyer.contact_email,
      buyer_name: buyer.customer_name,
      buyer_tel: buyer.contact_phone,
      buyer_addr: buyer.address,
    };

    // 결제 요청
    IMP.request_pay(paymentData, async (rsp: any) => {
      if (rsp.success) {
        try {
          const res = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: 1,
              product_ids: products.map((p) => p.product_id),
              reservation_date: new Date().toISOString().split("T")[0],
              reservation_time: new Date()
                .toISOString()
                .split("T")[1]
                .slice(0, 8),
              customer_name: buyer.customer_name,
              contact_phone: buyer.contact_phone,
              contact_email: buyer.contact_email,
              address: buyer.address,
              status: "pending",
              payment_method: "card",
              total_price: totalPrice,
            }),
          });

          if (!res.ok) throw new Error("주문 저장 실패");
          alert("결제 성공 및 주문 저장 완료!");
        } catch (err) {
          console.error(err);
          alert("결제는 성공했지만 주문 저장에 실패했습니다.");
        }
      } else {
        alert(`결제 실패: ${rsp.error_msg}`);
      }
    });
  };

  return (
    <div className="w-full border mt-2 p-6 rounded-lg shadow-md space-y-6">
      <div className="flex justify-between text-lg font-semibold">
        <span>총 결제금액</span>
        <span>{totalPrice.toLocaleString()}원</span>
      </div>
      <button
        type="button"
        onClick={handlePayment}
        className="w-full bg-orange-500 text-white py-3 rounded-md text-lg hover:bg-orange-600 transition"
      >
        결제하기
      </button>
    </div>
  );
};

export default Payment;
