import { useSetPageState } from '@cookers/global-hooks';
import { useTruckMasterDataQuery } from '@cookers/queries';
import { setTMasterData } from '@cookers/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { getUserFromLocalStorage } from '@cookers/utils';
const originator: string = getUserFromLocalStorage()?.originator || '';

// Component for Truck Settings Layout
export function TruckSettingsLayout() {
    useSetPageState('Truck Settings'); // Setting the page state to 'Truck Settings'
    useFetchTruckMasterDataQuery(); // Fetching truck master data

    return <Outlet />; // Rendering nested routes
}

export default TruckSettingsLayout; // Exporting the component as default

// Custom hook to fetch truck master data and dispatch it to the store
const useFetchTruckMasterDataQuery = () => {
    const dispatch = useDispatch(); // Getting the dispatch function from react-redux
    const { truckMasterData } = useTruckMasterDataQuery(); // Fetching truck master data
    useEffect(() => {
        if (!truckMasterData) return; // Returning early if truck master data is not available
        dispatch(setTMasterData(truckMasterData)); // Dispatching the truck master data to the store
    }, [truckMasterData, dispatch]); // Dependencies array for useEffect to re-run when truckMasterData or dispatch changes
};
