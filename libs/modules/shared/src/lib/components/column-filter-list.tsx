import React from 'react';
import { Badge } from '@radix-ui/themes';
import { X as XIcon } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import { ColumnFilterListProps } from '@cookers/models';


export const ColumnFilterList: React.FC<ColumnFilterListProps> = ({
  items = [],
  onRemove,
  className = '',
  label = '', 
}) => {
  if (!items.length) return null;

  return (
    <div className={className + 'mb-4'}>
      {label && (
        <Label className="font-[600] text-[13px] mb-2 block">{label}</Label>
      )}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Badge key={item.id} className='hover:bg-blue-200 transition-colors' radius="medium" variant="soft" size="2">
            <div className="flex flex-row items-start justify-between w-full">
              <div className="max-w-[90%] text-wrap flex-wrap">
                {item.label}: <span className="font-extrabold">{item.value}</span>
              </div>
              {onRemove && (
                <XIcon 
                  size={16} 
                  className="cursor-pointer hover:text-red-600 transition-colors" 
                  onClick={() => onRemove(item)}
                />
              )}
            </div>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ColumnFilterList;