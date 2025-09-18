const { createOrder, updateOrderStatus } = require("../models/orders");
const fetch = require("node-fetch"); // 포트원 결제 연동용

// 주문 생성 + 결제 준비
async function makeOrder(req, res, next) {
  try {
    const user_id = req.user?.user_id || null;
    const {
      product_id,
      reservation_date,
      reservation_time,
      customer_name,
      contact_phone,
      contact_email,
      address,
      amount,
    } = req.body;

    if (
      !product_id ||
      !reservation_date ||
      !reservation_time ||
      !customer_name ||
      !contact_phone ||
      !contact_email ||
      !address ||
      !amount
    ) {
      return res.status(400).json({ message: "필수 필드가 없습니다." });
    }

    // 1. 주문 DB 저장
    const order_id = await createOrder(req.pool, {
      user_id,
      product_id,
      reservation_date,
      reservation_time,
      customer_name,
      contact_phone,
      contact_email,
      address,
    });

    // 2. 포트원 결제 준비
    const response = await fetch("https://api.iamport.kr/payments/prepare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PORTONE_API_KEY}`,
      },
      body: JSON.stringify({
        merchant_uid: `order_${order_id}`,
        amount,
      }),
    });

    const result = await response.json();

    if (result.code !== 0) {
      return res.status(500).json({ message: "결제 준비 실패", error: result });
    }

    res.status(201).json({
      message: "주문 생성 및 결제 준비 완료",
      order_id,
      payment_data: result.response,
    });
  } catch (error) {
    next(error);
  }
}

// 결제 완료 후 상태 업데이트
async function paymentComplete(req, res, next) {
  try {
    const { order_id, status } = req.body;

    const success = await updateOrderStatus(req.pool, order_id, status);
    if (!success)
      return res.status(404).json({ message: "주문을 찾을 수 없습니다." });

    res.json({ message: "주문 상태 업데이트 완료" });
  } catch (error) {
    next(error);
  }
}

module.exports = { makeOrder, paymentComplete };
