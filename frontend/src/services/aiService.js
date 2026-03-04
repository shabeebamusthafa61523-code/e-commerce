import API from "./api";

const ask = async (question) => {
  const res = await API.post("/ai/ask", { question });
  return res.data;
};

export default { ask };
