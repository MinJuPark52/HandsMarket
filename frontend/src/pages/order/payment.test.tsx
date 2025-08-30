import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Payment from "./payment";
import { addDoc } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  getApp: jest.fn(),
}));

describe("Payment 컴포넌트 결제 테스트", () => {
  const mockAddDoc = addDoc as jest.Mock;

  beforeEach(() => {
    (window as any).IMP = {
      init: jest.fn(),
      request_pay: jest.fn(),
    };

    jest.spyOn(window, "alert").mockImplementation(() => {});

    mockAddDoc.mockClear();
    (window.IMP.init as jest.Mock).mockClear();
    (window.IMP.request_pay as jest.Mock).mockClear();
  });

  const products = [
    { name: "테스트상품", options: "", quantity: 1, price: 1000 },
  ];

  const buyer = {
    name: "홍길동",
    email: "test@test.com",
    tel: "01012345678",
    address: "서울시 강남구",
    postcode: "12345",
  };

  it("결제 성공 시 Firestore에 저장하고 성공 alert 호출", async () => {
    mockAddDoc.mockResolvedValueOnce({});

    (window.IMP.request_pay as jest.Mock).mockImplementation(
      (data, callback) => {
        callback({
          success: true,
          imp_uid: "imp_123456",
          merchant_uid: data.merchant_uid,
          paid_amount: data.amount,
          buyer_email: data.buyer_email,
          buyer_name: data.buyer_name,
        });
      }
    );

    render(
      <Payment
        products={products}
        buyer={buyer}
        paymentMethod="card"
        validateForm={() => true}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /결제하기/i }));

    expect(window.IMP.init).toHaveBeenCalled();
    expect(window.IMP.request_pay).toHaveBeenCalled();

    await waitFor(() => expect(mockAddDoc).toHaveBeenCalled());
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("결제 성공!")
    );
  });

  it("결제 실패 시 에러 alert 호출", () => {
    (window.IMP.request_pay as jest.Mock).mockImplementation(
      (data, callback) => {
        callback({
          success: false,
          error_msg: "결제 실패",
        });
      }
    );

    render(
      <Payment
        products={products}
        buyer={buyer}
        paymentMethod="card"
        validateForm={() => true}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /결제하기/i }));

    expect(window.alert).toHaveBeenCalledWith("결제 실패");
  });

  it("유효성 검사 실패 시 결제 요청 안 함", () => {
    const validateForm = jest.fn(() => false);

    render(
      <Payment
        products={products}
        buyer={buyer}
        paymentMethod="card"
        validateForm={validateForm}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /결제하기/i }));

    expect(validateForm).toHaveBeenCalled();
    expect(window.IMP.request_pay).not.toHaveBeenCalled();
  });

  it("지원하지 않는 결제 수단 선택 시 alert 표시", () => {
    render(
      <Payment
        products={products}
        buyer={buyer}
        paymentMethod="bank"
        validateForm={() => true}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /결제하기/i }));

    expect(window.alert).toHaveBeenCalledWith(
      '"무통장 입금"는 아직 지원하지 않습니다.'
    );
  });
});
