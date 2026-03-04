import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// REGISTER
export const registerUser = (data) => {
  return API.post("/register", data);
};

// LOGIN
export const loginUser = async (data) => {
  const res = await API.post("/login", data);

  // Save token properly
  localStorage.setItem("token", res.data.token);

  return res;
};

// GET LOGGED-IN USER
export const getMe = async (token) => {
  return axios.get("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
};
