import { useSetPageState } from '@cookers/global-hooks';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { getUserFromLocalStorage } from '@cookers/utils';
import { setSalesOrderMasterData } from '@cookers/store';
import { useSalesOrderMasterDataQuery } from '../queries';

const originator: string = getUserFromLocalStorage()?.originator || '';

// Component for Sales Order Layout
export function SalesOrderLayout() {
  useSetPageState('Sales Order'); // Setting the page state to 'Sales Order'
  useFetchSalesOrderDataQuery(); // Fetching sales order data

  return <Outlet />; // Rendering nested routes
}

// Custom hook to fetch sales order data and dispatch it to the store
const useFetchSalesOrderDataQuery = () => {
  const dispatch = useDispatch(); // Getting the dispatch function from react-redux
  const { salesOrderMasterData } = useSalesOrderMasterDataQuery(); // Fetching sales order data
  
  useEffect(() => {
    if (!salesOrderMasterData) return; // Returning early if sales order data is not available
    dispatch(setSalesOrderMasterData(salesOrderMasterData)); // Dispatching the sales order data to the store
  }, [salesOrderMasterData, dispatch, originator]); // Dependencies array for useEffect to re-run when salesOrderData or dispatch changes
};

export default SalesOrderLayout;