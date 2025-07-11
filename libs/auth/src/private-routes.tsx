import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from './auth-provider';

export const PrivateRouteValidator = () => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace={true} />;
};
