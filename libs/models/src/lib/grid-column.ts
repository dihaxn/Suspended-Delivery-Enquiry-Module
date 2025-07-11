import { CellContext, HeaderContext } from "@tanstack/react-table";

export type GridColumn = {
  accessorKey: string;
  header?: (({ table }: HeaderContext<any, unknown>) => JSX.Element) | string | undefined;
  size?: number | undefined;
  IsSelect?: boolean | undefined;
  cell?: (({ row }: CellContext<any, unknown>) => JSX.Element) | undefined;
  id?: string | undefined;
};
