import { createContext, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { loginUser, userDetails } from "../endpoints";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken') || "");
  const navigate = useNavigate();

  const login = async ({username, password}) => {
    const data = await loginUser({username, password});
    if (data) {
      setToken(data.access);
      localStorage.setItem('accessToken', data.access);
      const userData = await userDetails({token})
      setUser(userData);
      navigate('/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem('accessToken');
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
