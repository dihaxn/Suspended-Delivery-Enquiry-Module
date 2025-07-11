import { useSetPageState } from '@cookers/global-hooks';
import { useCustomerFeedbackMasterDataQuery } from '@cookers/queries';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { getUserFromLocalStorage } from '@cookers/utils';
import { setCustomerFeedbackMasterData } from '@cookers/store';

const originator: string = getUserFromLocalStorage()?.originator || '';

// Component for Customer Feedback Layout
export function CustomerFeedbackLayout() {
  useSetPageState('Customer Feedback'); // Setting the page state to 'Customer Feedback'
  useFetchCustomerFeedbackDataQuery(); // Fetching customer feedback data

  return <Outlet />; // Rendering nested routes
}

export default CustomerFeedbackLayout; // Exporting the component as default

// Custom hook to fetch customer feedback data and dispatch it to the store
const useFetchCustomerFeedbackDataQuery = () => {
  const dispatch = useDispatch(); // Getting the dispatch function from react-redux
  const { customerFeedbackMasterData } = useCustomerFeedbackMasterDataQuery(); // Fetching customer feedback data
  
  useEffect(() => {
    if (!customerFeedbackMasterData) return; // Returning early if customer feedback data is not available
    const modifiedMasterData = {
      ...customerFeedbackMasterData,
      activeUsers: customerFeedbackMasterData.personRaisedList?.filter(
      (person: { status: number }) => person.status === 1
      ) || []
    };
    dispatch(setCustomerFeedbackMasterData(modifiedMasterData)); // Dispatching the customer feedback data to the store
  }, [customerFeedbackMasterData, dispatch, originator]); // Dependencies array for useEffect to re-run when customerFeedbackData or dispatch changes
};
