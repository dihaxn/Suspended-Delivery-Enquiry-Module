import { useSetPageState } from '@cookers/global-hooks';
import { useSupplierNcrMasterDataQuery } from '@cookers/queries';
import { setCloseOutBlockReadOnly, setDetailBlockReadOnly, setResponseBlockReadOnly, setSupplierNcrMasterData } from '@cookers/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

export function SupplierNCRLayout() {
  useSetPageState('Supplier NCR');
  useFetchSupplierNcrMasterDataQuery();

  return <Outlet />;
}

export default SupplierNCRLayout;

const useFetchSupplierNcrMasterDataQuery = () => {
  const dispatch = useDispatch();
  const { supplierNcrMasterData } = useSupplierNcrMasterDataQuery();
  useEffect(() => {
    if (!supplierNcrMasterData) return;
    dispatch(setSupplierNcrMasterData(supplierNcrMasterData));
  }, [supplierNcrMasterData, dispatch]);
};
