import { DataType, FilterItem, SalesOrderList as SalesOrder } from '@cookers/models';
import { DataTable } from '@cookers/modules/shared';
import { addColumnFilter1, setColumnVisibility,configStore, setSelectedSalesOrder, STORE, useStoreSelector } from '@cookers/store';
import { Grid } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DefaultColumnVisibility, getSalesOrderColumns,  } from './sales-order-list-column';
import { VisibilityState } from '@tanstack/react-table';

const dataType: DataType = 'SalesOrder';
export const SalesOrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { columnFilters, filter, masterData } = useStoreSelector(STORE.SalesOrder);
  const allColumns = getSalesOrderColumns(masterData);

  
  const hiddenColumnsForSTAN = [ 'pListNo', 'requiredQty', 'isOneOff'];
  const filteredColumns = filter.orderType === 'STAN' 
                    ? allColumns.filter((col) => !hiddenColumnsForSTAN.includes('accessorKey' in col ? col.accessorKey?.toString() : col.id ?? '')) 
                    : allColumns;
  
  const onRowClick = (selectObj: SalesOrder) => {
    dispatch(setSelectedSalesOrder(selectObj));
  };

  const onRowDoubleClick = (selectObj: SalesOrder) => {
    navigate(`/${configStore.appName}/sales-order/${selectObj.sOrderNo}`);
  };

  const addInvoiceColumnFilter = (item: FilterItem) => {
    if (item.id === 'dateRequired' && item.value) {
      item = {...item, value: new Date(item.value).toISOString()}; 
    }
    console.log("addInvoiceColumnFilter", item);
    dispatch(addColumnFilter1(item));
  };

  const onColumnVisibilityChange = (viabilityState: VisibilityState) => {
    //dispatch(setColumnVisibility(viabilityState));
  };

  return (
    <Grid width="100%" height="100%">
      <DataTable<SalesOrder>
        columns={filteredColumns}
        dataType={dataType}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}      
        leftColumnPin="sOrderNo"
        defaultColumnVisibility={DefaultColumnVisibility}
        columnFilterList={columnFilters}
        addColumnFilter={addInvoiceColumnFilter}        
        onColumnVisibilityChange={onColumnVisibilityChange}

      />
    </Grid>


    
  );
};