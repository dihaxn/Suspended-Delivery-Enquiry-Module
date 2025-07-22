import { useSetPageState } from '@cookers/global-hooks';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useSuspendedDeliveryMasterDataQuery } from '../queries';
import { setSuspendedDeliveryMasterData } from '@cookers/store';

export function SuspendedDeliveryLayout() {
  useSetPageState('Suspended Delivery');
  useSuspendedDeliveryDataQuery();

  return <Outlet />;
}

export default SuspendedDeliveryLayout;

const useSuspendedDeliveryDataQuery = () => {
  const dispatch = useDispatch();
  const { SuspendedDeliveryMasterData } = useSuspendedDeliveryMasterDataQuery();
  useEffect(() => {
    if (!SuspendedDeliveryMasterData) return;
    dispatch(setSuspendedDeliveryMasterData(SuspendedDeliveryMasterData));
  }, [SuspendedDeliveryMasterData, dispatch]);
};