export interface FilterItem {
  id: string;
  label: string;
  value: string;
}

export interface ColumnFilterListProps {
  items: FilterItem[];
  onRemove?: (item: FilterItem) => void;
  className?: string;
  label?: string; 
}
