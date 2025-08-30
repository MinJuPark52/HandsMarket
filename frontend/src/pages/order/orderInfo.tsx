import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./pay";

type OrdererInfoProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
};

const OrdererInfo: React.FC<OrdererInfoProps> = ({ register, errors }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="w-[100px] text-gray-700">주문자</label>
        <input
          {...register("name")}
          placeholder="이름을 입력하세요"
          className="flex-1 border px-3 py-2 rounded-md h-[45px] focus:outline-none focus:border-gray-400"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="w-[100px] text-gray-700">연락처</label>
        <input
          {...register("phone")}
          placeholder="- 없이 입력해주세요"
          className="flex-1 border px-3 py-2 rounded-md h-[45px] focus:outline-none focus:border-gray-400"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="w-[100px] text-gray-700">이메일 주소</label>
        <input
          {...register("email")}
          placeholder="example@naver.com"
          className="flex-1 border px-3 py-2 rounded-md h-[45px] focus:outline-none focus:border-gray-400"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="w-[100px] text-gray-700">배송지</label>
        <input
          {...register("address")}
          placeholder="주소를 입력하세요"
          className="flex-1 border px-3 py-2 rounded-md h-[45px] focus:outline-none focus:border-gray-400"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
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
