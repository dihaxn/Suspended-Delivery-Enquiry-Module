import { helper } from '@cookers/helpers';
import { DataType } from '@cookers/models';
import { DataTable, SystemImprovement } from '@cookers/modules/shared';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Filter } from './components';
const dataType: DataType = 'System';
export function SystemImprovements() {
  const incidentId = helper.call<string>('getIncidentId');

  const SystemImprovementColumns = useMemo<ColumnDef<SystemImprovement>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'systemName',
        cell: (info) => info.getValue(),
      },

      {
        accessorKey: 'status',
        header: 'Status',
      },
    ],
    []
  );

  const onRowClick = (selectObj: SystemImprovement) => {};

  const onDoubleClick = (selectObj: SystemImprovement) => {};

  return (
    <div>
      <h1>Welcome to SystemImprovements! {incidentId}</h1>
      <Filter />
      <DataTable<SystemImprovement> columns={SystemImprovementColumns} dataType={dataType} onRowClick={onRowClick} onRowDoubleClick={onDoubleClick} />
    </div>
  );
}

export default SystemImprovements;
