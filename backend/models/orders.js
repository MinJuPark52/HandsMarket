async function createOrder(pool, order) {
  const query = `
    INSERT INTO reservations
    (user_id, product_id, reservation_date, reservation_time, customer_name, contact_phone, contact_email, address, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;
  const params = [
    order.user_id,
    order.product_id,
    order.reservation_date,
    order.reservation_time,
    order.customer_name,
    order.contact_phone,
    order.contact_email,
    order.address,
  ];

  const [result] = await pool.query(query, params);
  return result.insertId;
}

async function getOrderById(pool, order_id) {
  const [rows] = await pool.query(
    "SELECT * FROM reservations WHERE reservation_id = ?",
    [order_id]
  );
  return rows[0];
}

async function updateOrderStatus(pool, order_id, status) {
  const [result] = await pool.query(
    "UPDATE reservations SET status = ? WHERE reservation_id = ?",
    [status, order_id]
  );
  return result.affectedRows > 0;
}

module.exports = { createOrder, getOrderById, updateOrderStatus };
