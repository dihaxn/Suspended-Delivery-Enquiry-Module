import { useSetPageState } from '@cookers/global-hooks';
import { useIncidentMasterDataQuery } from '@cookers/queries';
import { setMasterData } from '@cookers/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { getUserFromLocalStorage } from '@cookers/utils';
const originator: string = getUserFromLocalStorage()?.originator || '';
// Component for Incident Management Layout
export function IncidentManagementLayout() {
  useSetPageState('Incident Management'); // Setting the page state to 'Incident Management'
  useFetchIncidentMasterDataQuery(); // Fetching incident master data

  return <Outlet />; // Rendering nested routes
}

export default IncidentManagementLayout; // Exporting the component as default

// Custom hook to fetch incident master data and dispatch it to the store
const useFetchIncidentMasterDataQuery = () => {
  const dispatch = useDispatch(); // Getting the dispatch function from react-redux
  const { incidentMasterData } = useIncidentMasterDataQuery(); // Fetching incident master data
  useEffect(() => {
    if (!incidentMasterData) return; // Returning early if incident master data is not available
    dispatch(setMasterData(incidentMasterData)); // Dispatching the incident master data to the store
  }, [incidentMasterData, dispatch,originator]); // Dependencies array for useEffect to re-run when incidentMasterData or dispatch changes
};
