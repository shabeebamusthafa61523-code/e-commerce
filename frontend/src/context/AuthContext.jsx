import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, getMe } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

 const login = async (data) => {
  const res = await loginUser(data);
console.log("LOGIN RESPONSE:", res.data);
  setUser(res.data);
  localStorage.setItem("user", JSON.stringify(res.data));
};

 const logout = () => {
  setUser(null);
  localStorage.removeItem("user");
};
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
