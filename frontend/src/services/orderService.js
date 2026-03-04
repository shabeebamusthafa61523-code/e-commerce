import API from "./api";

const createOrder = async (orderData) => {
  const res = await API.post("/orders", orderData);
  return res.data;
};

const getMyOrders = async () => {
  const res = await API.get("/orders/my");
  return res.data;
};

export default { createOrder, getMyOrders };
