import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { loginUser, userDetails } from "../endpoints";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken') || "");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const userData = await userDetails({token});
          setUser(userData);
          navigate('/dashboard');
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, [token])

  const login = async ({username, password}) => {
    const data = await loginUser({username, password});

    if (data) {
      setToken(data.access);
      localStorage.setItem('accessToken', data.access);
      const userData = await userDetails({token: data.access})
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

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
