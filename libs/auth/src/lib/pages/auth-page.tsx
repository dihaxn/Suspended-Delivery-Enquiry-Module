import { setUserDetails } from '@cookers/store';
import { getOriginatorFromLocalStorage, getWso2TokenFromLocalStorage } from '@cookers/utils';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../auth-provider';
import { getLoginDetails } from '../logic/get-login-details';
export const AuthPage = () => {
  const access_token = getWso2TokenFromLocalStorage()?.access_token || '';
  const localOriginator = getOriginatorFromLocalStorage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleLogin, handleLogout } = useAuthContext();
  const processLogin = async (username: string, token?: any) => {
    try {
      const { userData } = await getLoginDetails(username);
      if (userData.originator) {
        const proxyUser = {
          userName: userData.originator,
          empId: userData.empId,
          name: userData.name,
          firstLetter: userData.firstLetter,
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('proxyUser', JSON.stringify(proxyUser));

        dispatch(setUserDetails(userData));
        handleLogin();
      } else {
        throw new Error('User data retrieval failed');
      }
    } catch (error) {
      console.error('Login processing error:', error);
      handleLogout();
    }
  };
  useEffect(() => {
    if (access_token && localOriginator) {
      processLogin(localOriginator);
    } else {
      //handleLogout();
    }
  }, [access_token, navigate, handleLogout]);

  return null; // No UI needed
};
