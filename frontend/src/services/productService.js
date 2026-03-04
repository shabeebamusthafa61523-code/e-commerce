import API from "./api";

const getProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

const createProduct = async (data) => {
  const res = await API.post("/products", data);
  return res.data;
};

const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

export default { getProducts, createProduct, deleteProduct };
