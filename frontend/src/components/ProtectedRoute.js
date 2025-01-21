import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);

  if(!user) return <Navigate to="/login"/>
  return <Outlet/>
}

export default ProtectedRoute;
