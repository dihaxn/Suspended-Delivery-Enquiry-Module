import {useState,useEffect} from 'react'
import { Header, MainNavigation } from '@cookers/modules/common';
import { Outlet } from 'react-router-dom';
import './operations-app.layout.css';
import { useAuthContext } from '@cookers/auth';
import { useNavigate } from 'react-router-dom';
import { useGlobalMasterQuery } from '@cookers/queries';
import { useDispatch } from 'react-redux';
import { setGlobalMasterData } from '@cookers/store';
export const OperationsAppLayout = () => {
  const dispatch = useDispatch();
  const { globalLookupData } = useGlobalMasterQuery();
  useEffect(() => {
      if (!globalLookupData) return;
      dispatch(setGlobalMasterData(globalLookupData));
    }, [globalLookupData, dispatch]);
 /* 
 const [isAuthenticated] = useState<boolean>(
         localStorage.getItem("isAuthenticated") === "true"
       );
        const navigate = useNavigate();
             const { handleLogout } = useAuthContext();
       if (!isAuthenticated) {
        handleLogout();
    }  */
 
  return (
    <div className="operations-app-layout">
      <div className="main-navigation">
        <MainNavigation />
      </div>
      <div className="operations-app-header">
        <Header />
      </div>
      <div className="content-block">
        <Outlet />
      </div>
    </div>
  );
};
