import React from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getApp } from "firebase/app";

declare global {
  interface Window {
    IMP?: any;
  }
}

type Product = {
  name: string;
  options: string;
  quantity: number;
  price: number;
};

type Buyer = {
  name: string;
  email: string;
  tel: string;
  address: string;
  postcode: string;
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
  const db = getFirestore(getApp());

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

    const { IMP } = window;
    const merchantCode = process.env.REACT_APP_PORTONE_MERCHANT_ID;

    if (!IMP || !merchantCode) {
      alert("결제 모듈이 로드되지 않았거나 가맹점 코드가 없습니다.");
      return;
    }

    IMP.init(merchantCode);

    const paymentData = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: `mid_${Date.now()}`,
      name: products[0]?.name || "상품",
      amount: totalPrice,
      buyer_email: buyer.email,
      buyer_name: buyer.name,
      buyer_tel: buyer.tel,
      buyer_addr: buyer.address,
      buyer_postcode: buyer.postcode,
    };

    IMP.request_pay(paymentData, async (rsp: any) => {
      if (rsp.success) {
        try {
          await addDoc(collection(db, "payments"), {
            imp_uid: rsp.imp_uid,
            merchant_uid: rsp.merchant_uid,
            amount: rsp.paid_amount,
            buyer_email: rsp.buyer_email,
            buyer_name: rsp.buyer_name,
            status: "paid",
            paid_at: new Date(),
          });
          alert("결제 성공!");
        } catch (err) {
          alert("결제는 성공했지만 저장에 실패했습니다.");
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
