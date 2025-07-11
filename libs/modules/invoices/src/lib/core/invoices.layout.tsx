import { useSetPageState } from '@cookers/global-hooks';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useInvoiceMasterData } from '../queries/invoice-master-data-query';
import { configStore, setInvoiceMasterData } from '@cookers/store';
import { getUserFromLocalStorage } from '@cookers/utils';
import { ToastWrapper, useToast } from '@cookers/modules/shared';

const originator: string = getUserFromLocalStorage()?.originator || '';

export function InvoicesLayout() {
  useSetPageState('Invoices');
  useFetchInvoiceDataQuery();

  return <Outlet />;
}

export default InvoicesLayout;

const useFetchInvoiceDataQuery = () => {
  const dispatch = useDispatch(); // Getting the dispatch function from react-redux
  const { invoiceMasterData } = useInvoiceMasterData(); // Fetching customer feedback data

  useEffect(() => {
    if (!invoiceMasterData) return; // Returning early if customer feedback data is not available
    dispatch(setInvoiceMasterData(invoiceMasterData)); // Dispatching the customer feedback data to the store
  }, [invoiceMasterData, dispatch, originator]); // Dependencies array for useEffect to re-run when InvoiceData or dispatch changes
};
