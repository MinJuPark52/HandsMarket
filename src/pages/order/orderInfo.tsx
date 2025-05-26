import React from "react";
import { UseFormRegister } from "react-hook-form";
import { FormData } from "./pay";

interface OrdererInfoProps {
  register: UseFormRegister<FormData>;
}

const OrdererInfo: React.FC<OrdererInfoProps> = ({ register }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="w-[100px] text-gray-700">주문자</label>
        <input
          {...register("name")}
          placeholder="이름을 입력하세요"
          className="flex-1 border px-3 py-2 rounded-md h-[45px] focus:outline-none focus:border-gray-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="w-[100px] text-gray-700">연락처</label>
        <input
          {...register("phone")}
          placeholder="- 없이 입력해주세요"
          className="flex-1 border px-3 py-2 rounded-md h-[45px] focus:outline-none focus:border-gray-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="w-[100px] text-gray-700">이메일 주소</label>
        <input
          {...register("email")}
          placeholder="example@naver.com"
          className="flex-1 border px-3 py-2 rounded-md h-[45px] focus:outline-none focus:border-gray-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="w-[100px] text-gray-700">주소</label>
        <input
          {...register("address")}
          placeholder="주소를 입력하세요"
          className="flex-1 border px-3 py-2 rounded-md h-[45px] focus:outline-none focus:border-gray-400"
        />
      </div>
      <div className="flex items-start gap-2">
        <label className="w-[100px] text-gray-700 pt-2">요청 사항</label>
        <textarea
          {...register("request")}
          placeholder="배송 요청사항을 입력해주세요"
          className="flex-1 border px-3 py-2 rounded-md min-h-[80px] focus:outline-none focus:border-gray-400"
        />
      </div>
    </div>
  );
};

export default OrdererInfo;
