import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProductDetailPage from "./productDetail";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useLoginStore from "../../stores/useLoginStore";

jest.mock("@tanstack/react-query");
jest.mock("../../stores/useLoginStore");

const mockedUseQuery = useQuery as jest.Mock;
const mockedUseLoginStore = useLoginStore as unknown as jest.Mock;

const sampleProduct = {
  id: "1",
  image: "image.jpg",
  title: "테스트 상품",
  description: "설명",
  price: 10000,
  options: [
    {
      name: "color",
      label: "색상",
      values: [
        { label: "빨강", price: 1000 },
        { label: "파랑", price: 0 },
      ],
    },
  ],
  author: {
    name: "작가",
    profileImage: "author.jpg",
  },
  tags: ["tag1"],
};

describe("ProductDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (id = "1") =>
    render(
      <MemoryRouter initialEntries={[`/product/${id}`]}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<div>로그인 페이지</div>} />
          <Route path="/cart" element={<div>장바구니 페이지</div>} />
          <Route path="/pay" element={<div>결제 페이지</div>} />
        </Routes>
      </MemoryRouter>
    );

  test("로딩 상태일 때 로더 표시", () => {
    mockedUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    renderComponent();
    expect(screen.getByText(/loading/i)).not.toBeNull(); // 실제로는 BeatLoader 존재하는지 확인 가능
  });

  test("에러 또는 제품이 없으면 메시지 출력", () => {
    mockedUseQuery.mockReturnValue({ data: null, isLoading: false, error: {} });
    renderComponent();
    expect(screen.getByText(/not found or error/i)).toBeInTheDocument();
  });

  test("제품 정보가 정상적으로 렌더링된다", () => {
    mockedUseQuery.mockReturnValue({
      data: sampleProduct,
      isLoading: false,
      error: null,
    });
    mockedUseLoginStore.mockReturnValue({ uid: null });

    renderComponent();

    expect(screen.getByText(sampleProduct.title)).toBeInTheDocument();
    expect(screen.getByText(sampleProduct.description)).toBeInTheDocument();
    expect(screen.getByText("색상")).toBeInTheDocument();
  });

  test("옵션 선택 후 조합 추가 및 수량 변경, 삭제 동작", async () => {
    mockedUseQuery.mockReturnValue({
      data: sampleProduct,
      isLoading: false,
      error: null,
    });
    mockedUseLoginStore.mockReturnValue({ uid: null });

    renderComponent();

    const select = screen.getByRole("combobox", { name: /색상/i });
    fireEvent.change(select, { target: { value: "빨강" } });

    await waitFor(() => {
      expect(screen.getByText(/색상: 빨강/)).toBeInTheDocument();
    });

    const plusBtn = screen.getByText("+");
    fireEvent.click(plusBtn);

    const minusBtn = screen.getByText("-");
    fireEvent.click(minusBtn);

    const removeBtn = screen.getByRole("button", { name: /×/i });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByText(/색상: 빨강/)).not.toBeInTheDocument();
    });
  });

  test("로그인 안 된 상태에서 장바구니 클릭 시 로그인 페이지로 이동", () => {
    mockedUseQuery.mockReturnValue({
      data: sampleProduct,
      isLoading: false,
      error: null,
    });
    mockedUseLoginStore.mockReturnValue({ uid: null });

    renderComponent();

    fireEvent.change(screen.getByRole("combobox", { name: /색상/i }), {
      target: { value: "빨강" },
    });

    const cartBtn = screen.getByText("장바구니");
    fireEvent.click(cartBtn);

    expect(screen.getByText("로그인 페이지")).toBeInTheDocument();
  });

  test("로그인 상태에서 장바구니 클릭 시 localStorage에 저장 후 장바구니 페이지 이동", () => {
    mockedUseQuery.mockReturnValue({
      data: sampleProduct,
      isLoading: false,
      error: null,
    });
    mockedUseLoginStore.mockReturnValue({ uid: "user123" });

    renderComponent();

    fireEvent.change(screen.getByRole("combobox", { name: /색상/i }), {
      target: { value: "빨강" },
    });

    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    const cartBtn = screen.getByText("장바구니");
    fireEvent.click(cartBtn);

    expect(setItemSpy).toHaveBeenCalledWith(
      "cart",
      expect.stringContaining('"product"')
    );
    expect(screen.getByText("장바구니 페이지")).toBeInTheDocument();
  });

  test("바로 구매 클릭 시 localStorage에 저장 후 결제 페이지 이동", () => {
    mockedUseQuery.mockReturnValue({
      data: sampleProduct,
      isLoading: false,
      error: null,
    });
    mockedUseLoginStore.mockReturnValue({ uid: "user123" });

    renderComponent();

    fireEvent.change(screen.getByRole("combobox", { name: /색상/i }), {
      target: { value: "빨강" },
    });

    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    const buyBtn = screen.getByText("바로 구매");
    fireEvent.click(buyBtn);

    expect(setItemSpy).toHaveBeenCalledWith("directBuy", expect.any(String));
    expect(screen.getByText("결제 페이지")).toBeInTheDocument();
  });
});
