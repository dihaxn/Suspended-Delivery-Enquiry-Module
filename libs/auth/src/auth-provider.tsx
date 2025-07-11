import { User } from '@cookers/models';
import { clearIncidentState,clearAllStates,store } from '@cookers/store';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useNavigationBlock  } from "@cookers/modules/common";
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(localStorage.getItem('isAuthenticated') === 'true');

  const queryClient = useQueryClient();
  const { setBlocked } = useNavigationBlock();
  const handleLogin = useCallback(() => {
    //setUser({ id: 1 });
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    navigate(`${process.env.NX_PUBLIC_COOKERS_APP_NAME}`);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    queryClient.clear();
    setUser(null);
    store.dispatch(clearAllStates());
    localStorage.clear();
    setIsAuthenticated(false);
    setBlocked(false);
    navigate('/login');
    window.location.reload();
  }, [navigate, dispatch]);

  return (
    <AuthContext.Provider
      value={useMemo(() => ({ user, isAuthenticated, handleLogin, handleLogout }), [user, isAuthenticated, handleLogin, handleLogout])}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
