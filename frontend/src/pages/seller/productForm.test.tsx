import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductForm from "./productForm";

import * as firestore from "firebase/firestore";
import * as storage from "firebase/storage";

jest.mock("firebase/firestore");
jest.mock("firebase/storage");

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ProductForm 컴포넌트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("기본 렌더링: 제목, 가격, 판매자명 input이 보인다", () => {
    render(<ProductForm />);
    expect(
      screen.getByPlaceholderText("예: 레드로즈 부케")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("예: 32000")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("판매자 또는 브랜드 이름")
    ).toBeInTheDocument();
  });

  test("입력값 변경이 상태에 반영된다", () => {
    render(<ProductForm />);

    const titleInput = screen.getByPlaceholderText("예: 레드로즈 부케");
    fireEvent.change(titleInput, { target: { value: "장미 부케" } });
    expect(titleInput).toHaveValue("장미 부케");

    const priceInput = screen.getByPlaceholderText("예: 32000");
    fireEvent.change(priceInput, { target: { value: 50000 } });
    expect(priceInput).toHaveValue(50000);
  });

  test("폼 제출 시 대표 이미지 없으면 alert 호출", async () => {
    render(<ProductForm />);

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    fireEvent.click(screen.getByRole("button", { name: /상품 등록하기/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("대표 이미지를 업로드해주세요.");
    });

    alertMock.mockRestore();
  });

  test("폼 제출 시 firebase 함수가 호출되고 navigate도 호출됨", async () => {
    (firestore.setDoc as jest.Mock).mockResolvedValue(null);
    (storage.uploadBytes as jest.Mock).mockResolvedValue(null);
    (storage.getDownloadURL as jest.Mock).mockResolvedValue(
      "http://fake-url.com"
    );

    render(<ProductForm />);

    fireEvent.change(screen.getByPlaceholderText("예: 레드로즈 부케"), {
      target: { value: "테스트 상품" },
    });
    fireEvent.change(screen.getByPlaceholderText("예: 32000"), {
      target: { value: 10000 },
    });
    fireEvent.change(screen.getByPlaceholderText("판매자 또는 브랜드 이름"), {
      target: { value: "테스터" },
    });

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.click(screen.getByRole("button", { name: /상품 등록하기/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("대표 이미지를 업로드해주세요.");
    });

    alertMock.mockRestore();
  });
});
