import { useSetPageState } from '@cookers/global-hooks';
import { useCarrierMasterDataQuery } from '../queries/use-carrier-master-data-query';
import {  setCarrierMasterData } from '@cookers/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

export function CarrierMasterLayout() {
  useSetPageState('Carrier Master');
 useFetchCarrierMasterDataQuery();

  return <Outlet />;
}

export default CarrierMasterLayout;

 const useFetchCarrierMasterDataQuery = () => {
  const dispatch = useDispatch();
  const { carrierMasterData } = useCarrierMasterDataQuery();
  useEffect(() => {
    if (!carrierMasterData) return;
    dispatch(setCarrierMasterData(carrierMasterData));
  }, [carrierMasterData, dispatch]);
};
 