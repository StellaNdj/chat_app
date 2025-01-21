import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, token } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" />;
  if (!user) return <div>Loading...</div>; 

  return <Outlet />;
}

export default ProtectedRoute;
