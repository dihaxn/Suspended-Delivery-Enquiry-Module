import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DataTable } from '@cookers/modules/shared';
import { Grid } from '@cookers/ui';
import { DataType, FilterItem, InvoiceListItem } from '@cookers/models';
import { addColumnFilter, configStore, setColumnVisibility, setSelectedInvoice, setSelectedInvoices, STORE, useStoreSelector } from '@cookers/store';
import { InvoiceListColumns, DefaultColumnVisibility } from './invoice-list-column';
import { VisibilityState } from '@tanstack/react-table';

const dataType: DataType = 'Invoice';
export const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { columnFilters, masterData } = useStoreSelector(STORE.Invoice);
  const onRowClick = (selectObj: InvoiceListItem) => {
    dispatch(setSelectedInvoice(selectObj));
  };

  const onRowDoubleClick = (selectObj: InvoiceListItem) => {
    navigate(`/${configStore.appName}/invoices/${selectObj.ivceNo}`);
  };

  const onRowSelect = (selectObjects: InvoiceListItem[]) => {
    dispatch(setSelectedInvoices(selectObjects));
  };

  const addInvoiceColumnFilter = (item: FilterItem) => {
    dispatch(addColumnFilter(item));
  };

  const onColumnVisibilityChange = (viabilityState: VisibilityState) => {
    dispatch(setColumnVisibility(viabilityState));
  };

  return (
    <Grid width="100%" height="100%">
      <DataTable<InvoiceListItem>
        columns={InvoiceListColumns(masterData)}
        dataType={dataType}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        onRowSelect={onRowSelect}
        leftColumnPin="ivceNo"
        defaultColumnVisibility={DefaultColumnVisibility}
        columnFilterList={columnFilters}
        addColumnFilter={addInvoiceColumnFilter}
        onColumnVisibilityChange={onColumnVisibilityChange}
      />
    </Grid>
  );
};

export default InvoiceList;
